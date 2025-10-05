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
    const logoutBtn = document.getElementById('logout-btn');
    const userProfile = document.getElementById('user-profile');
    const userAvatar = document.getElementById('user-avatar');

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
            googleSigninBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18">...</svg>Sign in with Google';
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
            userProfile.style.display = 'flex';
            userAvatar.src = user.photoURL || 'https://via.placeholder.com/40';
            artieContainer.style.pointerEvents = 'auto';
            artieContainer.style.opacity = '1';
        } else {
            // User is signed out
            authOverlay.style.display = 'flex';
            userProfile.style.display = 'none';
            artieContainer.style.pointerEvents = 'none';
            artieContainer.style.opacity = '0.5';
            
            // Close chat if open
            if (artieContainer.classList.contains('chat-open')) {
                mainContent.classList.remove('squished');
                artieContainer.classList.remove('chat-open');
            }
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
        
        // Send initial greeting
        setTimeout(() => {
            sendArtieMessage(`Hello ${currentUser.displayName?.split(' ')[0] || 'there'}! I'm ARtie, your AI guide. How can I help you explore today? ✨`);
        }, 500);
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
            p.textContent = messageText;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    };

    const typeText = (element, text) => {
        isArtieTyping = true;
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            } else {
                clearInterval(typingInterval);
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
            const response = await fetch(API_PROXY_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userIdToken}`
                },
                body: JSON.stringify({
                    message: userMessage,
                    history: conversationHistory,
                    systemPrompt: SYSTEM_PROMPT
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

    // Auth state observer
    onAuthStateChanged(auth, async (user) => {
        currentUser = user;
        
        if (user) {
            // Get fresh ID token
            userIdToken = await user.getIdToken();
            console.log('User signed in:', user.email);
        } else {
            console.log('User signed out');
        }
        
        updateUIForAuthState(user);
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

    // Handle navigation clicks
    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
});