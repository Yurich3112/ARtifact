document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const askArtieBtn = document.getElementById('ask-artie-btn');
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
    // ADDED: Flag to track if the chat has been started
    let isChatInitialized = false;

    // --- Core Functions ---

    /**
     * Initializes the chat on the first open, displaying the welcome message.
     */
    const initializeChat = () => {
        chatMessages.innerHTML = ''; // Clear any residual content
        artieMessageIndex = 0;
        isArtieTyping = false;
        // Wait for the window to open before typing
        setTimeout(() => {
            typeArtieMessage();
        }, 500); // Delay should match the CSS transition duration
    };

    /**
     * Simulates ARtie typing a message letter by letter.
     */
    const typeArtieMessage = () => {
        if (isArtieTyping || artieMessageIndex >= chatScript.length) {
            return;
        }
        isArtieTyping = true;
        const messageText = chatScript[artieMessageIndex];
        
        // Create the message elements
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message artie-message';
        messageDiv.innerHTML = `
            <div class="message-avatar robot">
                <span class="material-symbols-outlined">smart_toy</span>
            </div>
            <div class="message-bubble">
                <p></p>
                <span class="message-time">${getCurrentTime()}</span>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        const p = messageDiv.querySelector('p');
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom

        // Type out the message
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
        }, 35); // Adjust typing speed (milliseconds)
    };
    
    /**
     * Adds the user's message to the chat window.
     */
    const addUserMessage = () => {
        const text = chatInput.value.trim();
        if (text === '' || isArtieTyping) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-bubble">
                <p>${text}</p>
                <span class="message-time">${getCurrentTime()}</span>
            </div>
            <div class="message-avatar user">
               <span>U</span>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Trigger ARtie's next response
        setTimeout(typeArtieMessage, 1000); // Add a 1-second delay for realism
    };

    /**
     * Gets the current time in a HH:MM AM/PM format.
     */
    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };


    // --- Event Listeners ---

    // Open chatbot
    askArtieBtn.addEventListener('click', () => {
        // Always perform the UI changes to show the window
        mainContent.classList.add('squished');
        chatbotWindow.classList.add('visible');
        askArtieBtn.classList.add('hidden');

        // UPDATED: Only start a new chat if it hasn't been started before
        if (!isChatInitialized) {
            initializeChat();
            isChatInitialized = true; // Set the flag to true after the first run
        }
    });

    // Close chatbot
    closeChatBtn.addEventListener('click', () => {
        mainContent.classList.remove('squished');
        chatbotWindow.classList.remove('visible');
        askArtieBtn.classList.remove('hidden');
    });

    // Handle sending a message
    sendBtn.addEventListener('click', addUserMessage);
    chatInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            addUserMessage();
        }
    });

    // Handle navigation clicks
    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            console.log(`Navigated to: ${item.querySelector('span:last-child').textContent}`);
        });
    });
});