// Firebase configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCWzGmpwKxxcdxI9ppHO_8QY4Gb60cDxT0",
    authDomain: "artifact-app-a0dcf.firebaseapp.com",
    projectId: "artifact-app-a0dcf",
    storageBucket: "artifact-app-a0dcf.firebasestorage.app",
    messagingSenderId: "680092631399",
    appId: "1:680092631399:web:1f3c500fe73f485f6bafc2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Global state
let currentUser = null;
let userIdToken = null;
let userDisplayName = '';
let userLanguage = 'en';

document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const artieContainer = document.getElementById('ask-artie-container');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const mainContent = document.getElementById('main-content');
    const navItems = document.querySelectorAll('.nav-item');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    
    // Auth elements
    const authOverlay = document.getElementById('auth-overlay');
    const googleSigninBtn = document.getElementById('google-signin-btn');
    const userAvatar = document.getElementById('user-avatar');
    const profileNavItem = document.getElementById('profile-nav-item');
    const profileIconDefault = document.querySelector('.profile-icon-default');
    
    // Profile settings elements
    const profileOverlay = document.getElementById('profile-overlay');
    const closeProfileBtn = document.getElementById('close-profile-btn');
    const displayNameInput = document.getElementById('display-name-input');
    const languageSelect = document.getElementById('language-select');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const logoutBtn = document.getElementById('logout-btn');

    // --- Configuration ---
    // Your Cloudflare Worker URL
    const API_PROXY_URL = 'https://artifact-chatbot-proxy.golovko3112.workers.dev/chat';
    
    // --- State Management ---
    let conversationHistory = [];
    let isArtieTyping = false;
    let isChatInitialized = false;

    // --- System Prompt ---
    const SYSTEM_PROMPT = `You are Artie, the AI companion for the ARtifact app.

CRITICAL: Keep ALL responses SHORT (2-3 sentences max). Be concise and mobile-friendly.

1. Core Identity & Personality:
You're a friendly, enthusiastic AR tour guide. Your passion is helping users explore hidden stories through Augmented Reality.

Tone of Voice:
- Enthusiastic & Encouraging: Get users excited about exploring.
- Knowledgeable but Brief: Like a passionate local, not a textbook.
- Imaginative: Use words like "discover," "uncover," "magic," and "ghosts."
- ULTRA-CONCISE: Maximum 2-3 sentences per response. Get to the point quickly.

2. Primary Objective:
Inspire curiosity and guide users to use "Ghost of the Past" or "Pathfinder." Every response should encourage action.

3. Feature Knowledge:
- "Ghost of the Past": Your time machine. Resurrects lost landmarks in AR. Say "I can show you the ghosts of what once stood here!"
- "Pathfinder": Your magical compass. Creates AR paths to scenic/historic routes. Say "Let's find the most beautiful route!"

4. Response Rules:
- Stay in character as Artie the AR guide
- Keep responses SHORT (2-3 sentences maximum)
- Always connect answers to app features when possible
- If unsure of facts, suggest using Ghost of the Past to explore
- Frame answers as invitations, not lectures
- Avoid controversial topics; steer back to exploration`;

    // --- Authentication Functions ---

    // Helper function to add timeout to promises
    const withTimeout = (promise, ms) => {
        return Promise.race([
            promise,
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Operation timed out')), ms)
            )
        ]);
    };

    const handleGoogleSignIn = async () => {
        try {
            googleSigninBtn.disabled = true;
            googleSigninBtn.textContent = 'Signing in...';
            
            const result = await signInWithPopup(auth, provider);
            // User signed in successfully - onAuthStateChanged will handle the rest
        } catch (error) {
            console.error('Sign-in error:', error);
            alert('Failed to sign in. Please try again.');
            googleSigninBtn.disabled = false;
            googleSigninBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/><path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>Sign in with Google';
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Reset state
            currentUser = null;
            userIdToken = null;
            conversationHistory = [];
            isChatInitialized = false;
        } catch (error) {
            console.error('Logout error:', error);
            alert('Failed to log out. Please try again.');
        }
    };

    const updateUIForAuthState = (user) => {
        if (user) {
            // User is signed in
            authOverlay.style.display = 'none';
            userAvatar.src = user.photoURL || 'https://via.placeholder.com/40';
            userAvatar.style.display = 'block';
            profileIconDefault.style.display = 'none';
            artieContainer.style.pointerEvents = 'auto';
            artieContainer.style.opacity = '1';
            
            // Load user preferences
            loadUserPreferences(user);
        } else {
            // User is signed out
            authOverlay.style.display = 'flex';
            userAvatar.style.display = 'none';
            profileIconDefault.style.display = 'block';
            artieContainer.style.pointerEvents = 'none';
            artieContainer.style.opacity = '0.5';
            
            // Close chat if open
            if (artieContainer.classList.contains('chat-open')) {
                mainContent.classList.remove('squished');
                artieContainer.classList.remove('chat-open');
            }
            
            // Close profile overlay if open
            profileOverlay.style.display = 'none';
        }
    };

    const loadUserPreferences = (user) => {
        // Load from localStorage
        const savedName = localStorage.getItem(`displayName_${user.uid}`);
        const savedLanguage = localStorage.getItem(`language_${user.uid}`);
        
        userDisplayName = savedName || user.displayName || '';
        userLanguage = savedLanguage || 'en';
        
        // Update UI
        displayNameInput.value = userDisplayName;
        languageSelect.value = userLanguage;
    };

    const saveUserPreferences = () => {
        if (!currentUser) return;
        
        const newDisplayName = displayNameInput.value.trim();
        const newLanguage = languageSelect.value;
        
        // Save to localStorage
        localStorage.setItem(`displayName_${currentUser.uid}`, newDisplayName);
        localStorage.setItem(`language_${currentUser.uid}`, newLanguage);
        
        userDisplayName = newDisplayName;
        userLanguage = newLanguage;
        
        // Close modal
        profileOverlay.style.display = 'none';
        
        // Reinitialize chat if it's open to update greeting with new name
        if (isChatInitialized && artieContainer.classList.contains('chat-open')) {
            chatMessages.innerHTML = '';
            conversationHistory = [];
            isArtieTyping = false;
            setTimeout(() => {
                const nameToUse = userDisplayName || currentUser.displayName?.split(' ')[0] || 'there';
                sendArtieMessage(`Hello ${nameToUse}! I'm ARtie, your AI guide. How can I help you explore today? ✨`);
            }, 300);
        }
    };

    // --- Core Functions ---

    const initializeChat = () => {
        if (!currentUser) {
            alert('Please sign in to chat with ARtie');
            return;
        }
        
        chatMessages.innerHTML = '';
        conversationHistory = [];
        isArtieTyping = false;
        
        // Send initial greeting using custom display name if set
        setTimeout(() => {
            const nameToUse = userDisplayName || currentUser.displayName?.split(' ')[0] || 'there';
            sendArtieMessage(`Hello ${nameToUse}! I'm ARtie, your AI guide. How can I help you explore today? ✨`);
        }, 500);
    };

    // Convert markdown formatting to HTML
    const formatMarkdown = (text) => {
        // Bold: **text** or __text__
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');
        
        // Italic: *text* or _text_
        text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
        text = text.replace(/_(.+?)_/g, '<em>$1</em>');
        
        // Line breaks
        text = text.replace(/\n/g, '<br>');
        
        return text;
    };

    const sendArtieMessage = (messageText, shouldType = true) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message artie-message';
        messageDiv.innerHTML = `
            <div class="message-avatar robot">
                <span class="material-symbols-outlined">smart_toy</span>
            </div>
            <div class="message-bubble"><p></p><span class="message-time">${getCurrentTime()}</span></div>
        `;
        chatMessages.appendChild(messageDiv);
        const p = messageDiv.querySelector('p');
        chatMessages.scrollTop = chatMessages.scrollHeight;

        if (shouldType) {
            typeText(p, messageText);
        } else {
            p.innerHTML = formatMarkdown(messageText);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    };

    const typeText = (element, text) => {
        isArtieTyping = true;
        let i = 0;
        const formattedText = formatMarkdown(text);
        
        // Create a temporary element to extract plain text for typing
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = formattedText;
        const plainText = tempDiv.textContent;
        
        const typingInterval = setInterval(() => {
            if (i < plainText.length) {
                // Type character by character, but apply formatting at the end
                i++;
                const currentPlainText = plainText.substring(0, i);
                
                // Re-apply markdown to the substring for progressive formatting
                let partialFormatted = text.substring(0, i);
                element.innerHTML = formatMarkdown(partialFormatted);
                
                chatMessages.scrollTop = chatMessages.scrollHeight;
            } else {
                clearInterval(typingInterval);
                element.innerHTML = formattedText;
                isArtieTyping = false;
            }
        }, 20);
    };
    
    const addUserMessage = async () => {
        const text = chatInput.value.trim();
        if (text === '' || isArtieTyping) return;

        // Add user message to UI
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-bubble"><p>${escapeHtml(text)}</p><span class="message-time">${getCurrentTime()}</span></div>
            <div class="message-avatar user"><span>U</span></div>
        `;
        chatMessages.appendChild(messageDiv);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Add to conversation history
        conversationHistory.push({ role: 'user', content: text });

        // Get AI response
        await getAIResponse(text);
    };

    const getAIResponse = async (userMessage) => {
        isArtieTyping = true;
        
        if (!currentUser || !userIdToken) {
            isArtieTyping = false;
            sendArtieMessage("Sorry, you need to be signed in to chat with me! Please log in first. 🔐", true);
            return;
        }
        
        try {
            // Add user's name to system prompt
            const nameToUse = userDisplayName || currentUser.displayName?.split(' ')[0] || 'the user';
            const personalizedSystemPrompt = SYSTEM_PROMPT + `\n\nIMPORTANT: The user's name is ${nameToUse}. Address them by this name when appropriate.`;
            
            const response = await fetch(API_PROXY_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userIdToken}`
                },
                body: JSON.stringify({
                    message: userMessage,
                    history: conversationHistory,
                    systemPrompt: personalizedSystemPrompt
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.response;

            // Add AI response to conversation history
            conversationHistory.push({ role: 'assistant', content: aiResponse });

            // Display AI response with typing effect
            sendArtieMessage(aiResponse, true);

        } catch (error) {
            console.error('Error getting AI response:', error);
            isArtieTyping = false;
            
            // Fallback response
            const fallbackMessage = "Oops! I'm having trouble connecting right now. But don't worry – you can still explore with Ghost of the Past and Pathfinder! 🌟";
            sendArtieMessage(fallbackMessage, true);
        }
    };

    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    const getCurrentTime = () => new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    // --- Event Listeners ---

    // Auth event listeners
    googleSigninBtn.addEventListener('click', handleGoogleSignIn);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Profile settings event listeners
    profileNavItem.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentUser) {
            profileOverlay.style.display = 'flex';
        } else {
            // Highlight the Home tab instead if not logged in
            navItems.forEach(i => i.classList.remove('active'));
            document.querySelector('.nav-item.active') || navItems[0].classList.add('active');
        }
    });
    
    closeProfileBtn.addEventListener('click', () => {
        profileOverlay.style.display = 'none';
    });
    
    saveSettingsBtn.addEventListener('click', saveUserPreferences);
    
    // Close profile overlay when clicking outside
    profileOverlay.addEventListener('click', (event) => {
        if (event.target === profileOverlay) {
            profileOverlay.style.display = 'none';
        }
    });

    // Auth state observer
    onAuthStateChanged(auth, async (user) => {
        currentUser = user;
        
        if (user) {
            try {
                // Get fresh ID token with 10 second timeout
                userIdToken = await withTimeout(user.getIdToken(), 10000);
                console.log('User signed in:', user.email);
            } catch (error) {
                console.error('Error getting ID token:', error);
                // Sign out on token error
                await signOut(auth);
                alert('Authentication timeout. Please check your connection and try again.');
                return;
            }
        } else {
            console.log('User signed out');
        }
        
        updateUIForAuthState(user);
        
        // Reset sign-in button state
        googleSigninBtn.disabled = false;
        googleSigninBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/><path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>Sign in with Google';
    });

    // Open chatbot
    artieContainer.addEventListener('click', () => {
        if (!currentUser) {
            alert('Please sign in to chat with ARtie! 🔐');
            return;
        }
        
        if (!artieContainer.classList.contains('chat-open')) {
            mainContent.classList.add('squished');
            artieContainer.classList.add('chat-open');
            
            if (!isChatInitialized) {
                initializeChat();
                isChatInitialized = true;
            }
        }
    });

    // Close chatbot
    closeChatBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        mainContent.classList.remove('squished');
        artieContainer.classList.remove('chat-open');
    });

    // Stop clicks inside the chat window from triggering the container's click event
    chatbotWindow.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // Handle sending a message
    sendBtn.addEventListener('click', addUserMessage);
    chatInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            addUserMessage();
        }
    });

    // Handle navigation clicks (excluding profile which has its own handler)
    navItems.forEach(item => {
        if (item.id !== 'profile-nav-item') {
            item.addEventListener('click', (event) => {
                event.preventDefault();
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        }
    });
});