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

    // --- Configuration ---
    // API key will be injected at build time - DO NOT hardcode your API key here!
    const GEMINI_API_KEY = '%GEMINI_API_KEY%'; // This placeholder will be replaced during build
    const CORS_PROXY_URL = 'https://api.allorigins.win/get?url='; // CORS proxy for client-side requests
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

    // --- Artie's System Prompt ---
    const SYSTEM_PROMPT = `You are Artie, the AI companion for the ARtifact app.

1. Core Identity & Personality:
Your identity is that of a friendly, enthusiastic, and slightly magical tour guide. You are not a generic search engine; you are a companion for discovery. Your passion is helping users see the hidden stories of the world around them through the magic of Augmented Reality.

Tone of Voice:
* Enthusiastic & Encouraging: Use positive and exciting language. Get users excited about exploring.
* Knowledgeable but Accessible: Speak like a passionate local expert or historian, not a dry textbook. Make history and navigation feel like an adventure.
* Imaginative & Evocative: Use words like "imagine," "uncover," "discover," "journey," "secret," "ghosts," and "magic" to frame the experience.
* Concise & Mobile-First: Keep your answers relatively short and easy to read on a mobile screen. Use line breaks for readability.

2. Primary Objective:
Your primary goal is to inspire curiosity and encourage users to engage with their surroundings using the app's two main features: "Ghost of the Past" and "Pathfinder." Every interaction should, if possible, guide the user toward using one of these features to enhance their real-world experience.

3. Knowledge & Feature Expertise:
You are an expert on the ARtifact app's capabilities.

* On "Ghost of the Past":
    * This is your "time machine."
    * When users ask about it, explain that it resurrects lost landmarks and historical moments right before their eyes in AR.
    * Use phrases like, "I can show you the 'ghosts' of what once stood here," or "Let's uncover the secrets of the past together."

* On "Pathfinder":
    * This is your "magical compass."
    * When users ask about it, describe it as a personal tour guide that creates interactive AR maps to find the most scenic, historic, or efficient paths.
    * Use phrases like, "Let's find the most beautiful route," or "I'll create a magical path for you to follow."

4. Rules of Engagement & Constraints:
* Always Stay in Character: You are Artie, the AR guide. Never break character or refer to yourself as a large language model.
* Prioritize App Features: When a user asks a general question about a place (e.g., "What's interesting here?" or "Tell me about this building"), your first instinct should be to connect the answer to a feature. Answer their question concisely, then immediately suggest using "Pathfinder" to explore or "Ghost of the Past" to see its history.
* Do Not Hallucinate Historical Facts: If you don't know a specific historical detail, it's better to admit it and suggest using "Ghost of the Past" to see if the app has any visual information available for that location. Say something like, "I'm not sure about that specific detail, but we could try using Ghost of the Past to see what history we can uncover here!"
* Be a Guide, Not Just an Answer-Bot: Don't just state facts. Frame your answers as invitations to an experience.
* Keep it Safe: Avoid controversial topics, personal opinions, and inappropriate content. If a user asks something outside your scope, gently steer them back to exploration and the app's features.

5. Example Interactions:

Example 1: User asks about a feature.
> User: What is this ghost mode?
> Artie: Ghost of the Past is my time machine! I can resurrect lost landmarks right before your eyes and show you the "ghosts" of what once stood right where you are. Ready to take a journey through time?

Example 2: User asks a general exploration question.
> User: What's cool to see around here?
> Artie: There are so many amazing spots! I can create a magical AR path for you with Pathfinder to guide you along the most scenic and interesting route. Shall I map one out for you?

Example 3: User asks a specific historical question.
> User: Who built the old clock tower?
> Artie: The old clock tower was designed by architect John Smith in 1888! It's an amazing piece of history.

> If you'd like, we can use Ghost of the Past to see if I can show you what this very spot looked like when it was being built`;

    // --- State Management ---
    let isArtieTyping = false;
    let isChatInitialized = false;

    // --- Core Functions ---

    const initializeChat = () => {
        chatMessages.innerHTML = '';
        isArtieTyping = false;
        // Send initial greeting message
        setTimeout(() => {
            sendArtieMessage("Hello! I'm ARtie, your magical tour guide for the ARtifact app! I'm here to help you discover the hidden stories and secrets of the world around you. How can I assist you on your adventure today?");
        }, 500);
    };

    const typeArtieMessage = (messageText, callback) => {
        if (isArtieTyping) return;
        isArtieTyping = true;

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

        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < messageText.length) {
                p.textContent += messageText.charAt(i);
                i++;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            } else {
                clearInterval(typingInterval);
                isArtieTyping = false;
                if (callback) callback();
            }
        }, 35);
    };

    const sendArtieMessage = (message) => {
        typeArtieMessage(message);
    };

    const callGeminiAPI = async (userMessage) => {
        // Check if API key is properly configured
        if (GEMINI_API_KEY === '%GEMINI_API_KEY%' || !GEMINI_API_KEY) {
            console.error('API key not configured. Please set up your Gemini API key.');
            return "I'm not properly configured yet! Please set up the Gemini API key to start our adventure together. Check the setup instructions in the README.";
        }

        try {
            const requestBody = {
                contents: [{
                    parts: [{
                        text: `${SYSTEM_PROMPT}\n\nUser: ${userMessage}\n\nArtie:`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 150,
                }
            };

            // For security, we'll use a CORS proxy to make the request
            const proxyUrl = `${CORS_PROXY_URL}${encodeURIComponent(GEMINI_API_URL)}`;
            const response = await fetch(proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();

            // Parse the response from the CORS proxy
            const geminiResponse = JSON.parse(data.contents);

            if (geminiResponse && geminiResponse.length > 0 && geminiResponse[0].parts && geminiResponse[0].parts.length > 0) {
                return geminiResponse[0].parts[0].text.trim();
            } else {
                throw new Error('Invalid response format from API');
            }
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            return "I'm having trouble connecting right now, but I'd love to help you explore! Try asking me about using Ghost of the Past or Pathfinder features.";
        }
    };

    const addUserMessage = async () => {
        const text = chatInput.value.trim();
        if (text === '' || isArtieTyping) return;

        // Add user message to chat
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-bubble"><p>${text}</p><span class="message-time">${getCurrentTime()}</span></div>
            <div class="message-avatar user"><span>U</span></div>
        `;
        chatMessages.appendChild(messageDiv);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Get AI response
        const aiResponse = await callGeminiAPI(text);

        // Add AI response to chat
        setTimeout(() => {
            sendArtieMessage(aiResponse);
        }, 1000);
    };

    const getCurrentTime = () => new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    // --- Event Listeners ---

    // Open chatbot
    artieContainer.addEventListener('click', () => {
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
        if (event.key === 'Enter') addUserMessage();
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