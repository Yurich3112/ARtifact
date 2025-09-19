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

    // --- Chat Script ---
    const chatScript = [
        "Hello! I'm ARtie, your AI assistant. How can I help You today?",
        "It's your personal tour guide. I create an interactive AR map and find the most scenic and efficient path for you to explore.",
        "I resurrect lost landmarks right before your eyes. I show you the \"ghosts\" of what once stood here.",
        "Wonderful! Enjoy your journey through time. Let me know if you need anything else."
    ];
    let artieMessageIndex = 0;
    let isArtieTyping = false;
    let isChatInitialized = false;

    // --- Core Functions ---

    const initializeChat = () => {
        chatMessages.innerHTML = '';
        artieMessageIndex = 0;
        isArtieTyping = false;
        // Delay to allow animation to almost complete
        setTimeout(() => {
            typeArtieMessage();
        }, 500);
    };

    const typeArtieMessage = () => {
        if (isArtieTyping || artieMessageIndex >= chatScript.length) return;
        isArtieTyping = true;
        const messageText = chatScript[artieMessageIndex];
        
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
                artieMessageIndex++;
                isArtieTyping = false;
            }
        }, 35);
    };
    
    const addUserMessage = () => {
        const text = chatInput.value.trim();
        if (text === '' || isArtieTyping) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-bubble"><p>${text}</p><span class="message-time">${getCurrentTime()}</span></div>
            <div class="message-avatar user"><span>U</span></div>
        `;
        chatMessages.appendChild(messageDiv);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(typeArtieMessage, 1000);
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