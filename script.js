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

// Language names for system prompt
const languageNames = {
    en: 'English',
    uk: 'Ukrainian',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    cs: 'Czech',
    pl: 'Polish'
};

// Translations
const translations = {
    en: {
        auth: {
            welcome: 'Welcome to ARtifact',
            subtitle: 'Sign in to chat with ARtie, your AI tour guide',
            signIn: 'Sign in with Google',
            note: 'Only registered users can access ARtie chatbot'
        },
        settings: {
            title: 'Profile Settings',
            displayName: 'Display Name',
            namePlaceholder: 'Enter your name',
            nameNote: 'This is the name ARtie will use when talking to you',
            language: 'App Language',
            languageNote: 'Language for the app interface (ARtie responses coming soon)',
            save: 'Save Settings',
            signOut: 'Sign Out'
        },
        cards: {
            ghost: {
                title: 'Ghost of the Past',
                description: 'Uncover hidden stories and ancient secrets'
            },
            pathfinder: {
                title: 'Pathfinder',
                description: 'Navigate through mysterious locations'
            }
        },
        chat: {
            askButton: 'Ask ARtie',
            inputPlaceholder: 'Ask ARtie...',
            greeting: 'Hello {name}! I\'m ARtie, your AI guide. How can I help you explore today? ✨'
        },
        nav: {
            home: 'Home',
            explore: 'Explore',
            saved: 'Saved',
            profile: 'Profile'
        }
    },
    uk: {
        auth: {
            welcome: 'Ласкаво просимо до ARtifact',
            subtitle: 'Увійдіть, щоб поспілкуватися з ARtie, вашим AI-гідом',
            signIn: 'Увійти через Google',
            note: 'Тільки зареєстровані користувачі можуть користуватися чат-ботом ARtie'
        },
        settings: {
            title: 'Налаштування профілю',
            displayName: 'Ім\'я для відображення',
            namePlaceholder: 'Введіть ваше ім\'я',
            nameNote: 'Це ім\'я ARtie буде використовувати при спілкуванні з вами',
            language: 'Мова застосунку',
            languageNote: 'Мова інтерфейсу (мова відповідей ARtie незабаром)',
            save: 'Зберегти',
            signOut: 'Вийти'
        },
        cards: {
            ghost: {
                title: 'Привид минулого',
                description: 'Розкрийте приховані історії та давні секрети'
            },
            pathfinder: {
                title: 'Провідник',
                description: 'Подорожуйте таємничими місцями'
            }
        },
        chat: {
            askButton: 'Запитати ARtie',
            inputPlaceholder: 'Запитайте ARtie...',
            greeting: 'Привіт, {name}! Я ARtie, твій AI-гід. Чим можу допомогти сьогодні? ✨'
        },
        nav: {
            home: 'Головна',
            explore: 'Огляд',
            saved: 'Збережене',
            profile: 'Профіль'
        }
    },
    es: {
        auth: {
            welcome: 'Bienvenido a ARtifact',
            subtitle: 'Inicia sesión para chatear con ARtie, tu guía turístico con IA',
            signIn: 'Iniciar sesión con Google',
            note: 'Solo los usuarios registrados pueden acceder al chatbot ARtie'
        },
        settings: {
            title: 'Configuración de perfil',
            displayName: 'Nombre para mostrar',
            namePlaceholder: 'Introduce tu nombre',
            nameNote: 'Este es el nombre que ARtie usará al hablar contigo',
            language: 'Idioma de la aplicación',
            languageNote: 'Idioma de la interfaz (respuestas de ARtie próximamente)',
            save: 'Guardar',
            signOut: 'Cerrar sesión'
        },
        cards: {
            ghost: {
                title: 'Fantasma del pasado',
                description: 'Descubre historias ocultas y secretos antiguos'
            },
            pathfinder: {
                title: 'Explorador',
                description: 'Navega por lugares misteriosos'
            }
        },
        chat: {
            askButton: 'Preguntar a ARtie',
            inputPlaceholder: 'Pregunta a ARtie...',
            greeting: '¡Hola {name}! Soy ARtie, tu guía de IA. ¿Cómo puedo ayudarte a explorar hoy? ✨'
        },
        nav: {
            home: 'Inicio',
            explore: 'Explorar',
            saved: 'Guardado',
            profile: 'Perfil'
        }
    },
    fr: {
        auth: {
            welcome: 'Bienvenue sur ARtifact',
            subtitle: 'Connectez-vous pour discuter avec ARtie, votre guide touristique IA',
            signIn: 'Se connecter avec Google',
            note: 'Seuls les utilisateurs enregistrés peuvent accéder au chatbot ARtie'
        },
        settings: {
            title: 'Paramètres du profil',
            displayName: 'Nom d\'affichage',
            namePlaceholder: 'Entrez votre nom',
            nameNote: 'C\'est le nom qu\'ARtie utilisera pour vous parler',
            language: 'Langue de l\'application',
            languageNote: 'Langue de l\'interface (réponses ARtie bientôt)',
            save: 'Enregistrer',
            signOut: 'Se déconnecter'
        },
        cards: {
            ghost: {
                title: 'Fantôme du passé',
                description: 'Découvrez des histoires cachées et des secrets anciens'
            },
            pathfinder: {
                title: 'Éclaireur',
                description: 'Naviguez dans des lieux mystérieux'
            }
        },
        chat: {
            askButton: 'Demander à ARtie',
            inputPlaceholder: 'Demandez à ARtie...',
            greeting: 'Bonjour {name}! Je suis ARtie, votre guide IA. Comment puis-je vous aider à explorer aujourd\'hui? ✨'
        },
        nav: {
            home: 'Accueil',
            explore: 'Explorer',
            saved: 'Enregistré',
            profile: 'Profil'
        }
    },
    de: {
        auth: {
            welcome: 'Willkommen bei ARtifact',
            subtitle: 'Melden Sie sich an, um mit ARtie, Ihrem KI-Reiseführer, zu chatten',
            signIn: 'Mit Google anmelden',
            note: 'Nur registrierte Benutzer können auf den ARtie-Chatbot zugreifen'
        },
        settings: {
            title: 'Profileinstellungen',
            displayName: 'Anzeigename',
            namePlaceholder: 'Geben Sie Ihren Namen ein',
            nameNote: 'Dies ist der Name, den ARtie verwenden wird, wenn er mit Ihnen spricht',
            language: 'App-Sprache',
            languageNote: 'Sprache der Benutzeroberfläche (ARtie-Antworten demnächst)',
            save: 'Speichern',
            signOut: 'Abmelden'
        },
        cards: {
            ghost: {
                title: 'Geist der Vergangenheit',
                description: 'Entdecken Sie verborgene Geschichten und alte Geheimnisse'
            },
            pathfinder: {
                title: 'Pfadfinder',
                description: 'Navigieren Sie durch geheimnisvolle Orte'
            }
        },
        chat: {
            askButton: 'ARtie fragen',
            inputPlaceholder: 'Fragen Sie ARtie...',
            greeting: 'Hallo {name}! Ich bin ARtie, dein KI-Guide. Wie kann ich dir heute beim Erkunden helfen? ✨'
        },
        nav: {
            home: 'Startseite',
            explore: 'Erkunden',
            saved: 'Gespeichert',
            profile: 'Profil'
        }
    },
    it: {
        auth: {
            welcome: 'Benvenuto su ARtifact',
            subtitle: 'Accedi per chattare con ARtie, la tua guida turistica AI',
            signIn: 'Accedi con Google',
            note: 'Solo gli utenti registrati possono accedere al chatbot ARtie'
        },
        settings: {
            title: 'Impostazioni profilo',
            displayName: 'Nome visualizzato',
            namePlaceholder: 'Inserisci il tuo nome',
            nameNote: 'Questo è il nome che ARtie userà quando parla con te',
            language: 'Lingua dell\'app',
            languageNote: 'Lingua dell\'interfaccia (risposte ARtie presto)',
            save: 'Salva',
            signOut: 'Esci'
        },
        cards: {
            ghost: {
                title: 'Fantasma del passato',
                description: 'Scopri storie nascoste e segreti antichi'
            },
            pathfinder: {
                title: 'Esploratore',
                description: 'Naviga attraverso luoghi misteriosi'
            }
        },
        chat: {
            askButton: 'Chiedi ad ARtie',
            inputPlaceholder: 'Chiedi ad ARtie...',
            greeting: 'Ciao {name}! Sono ARtie, la tua guida AI. Come posso aiutarti a esplorare oggi? ✨'
        },
        nav: {
            home: 'Home',
            explore: 'Esplora',
            saved: 'Salvati',
            profile: 'Profilo'
        }
    },
    cs: {
        auth: {
            welcome: 'Vítejte v ARtifact',
            subtitle: 'Přihlaste se a chatujte s ARtie, vaším AI průvodcem',
            signIn: 'Přihlásit se pomocí Google',
            note: 'Pouze registrovaní uživatelé mají přístup k chatbotu ARtie'
        },
        settings: {
            title: 'Nastavení profilu',
            displayName: 'Zobrazované jméno',
            namePlaceholder: 'Zadejte své jméno',
            nameNote: 'Toto je jméno, které ARtie použije při rozhovoru s vámi',
            language: 'Jazyk aplikace',
            languageNote: 'Jazyk rozhraní (odpovědi ARtie již brzy)',
            save: 'Uložit',
            signOut: 'Odhlásit se'
        },
        cards: {
            ghost: {
                title: 'Duch minulosti',
                description: 'Odhalte skryté příběhy a pradávná tajemství'
            },
            pathfinder: {
                title: 'Průzkumník',
                description: 'Procházejte tajemnými místy'
            }
        },
        chat: {
            askButton: 'Zeptat se ARtie',
            inputPlaceholder: 'Zeptejte se ARtie...',
            greeting: 'Ahoj {name}! Jsem ARtie, tvůj AI průvodce. Jak ti dnes mohu pomoci s průzkumem? ✨'
        },
        nav: {
            home: 'Domů',
            explore: 'Prozkoumat',
            saved: 'Uložené',
            profile: 'Profil'
        }
    },
    pl: {
        auth: {
            welcome: 'Witamy w ARtifact',
            subtitle: 'Zaloguj się, aby porozmawiać z ARtie, swoim przewodnikiem AI',
            signIn: 'Zaloguj się przez Google',
            note: 'Tylko zarejestrowani użytkownicy mają dostęp do chatbota ARtie'
        },
        settings: {
            title: 'Ustawienia profilu',
            displayName: 'Wyświetlana nazwa',
            namePlaceholder: 'Wpisz swoje imię',
            nameNote: 'To jest imię, którego ARtie będzie używać rozmawiając z tobą',
            language: 'Język aplikacji',
            languageNote: 'Język interfejsu (odpowiedzi ARtie wkrótce)',
            save: 'Zapisz',
            signOut: 'Wyloguj się'
        },
        cards: {
            ghost: {
                title: 'Duch przeszłości',
                description: 'Odkryj ukryte historie i starożytne tajemnice'
            },
            pathfinder: {
                title: 'Tropiciel',
                description: 'Poruszaj się po tajemniczych lokacjach'
            }
        },
        chat: {
            askButton: 'Zapytaj ARtie',
            inputPlaceholder: 'Zapytaj ARtie...',
            greeting: 'Cześć {name}! Jestem ARtie, twój przewodnik AI. Jak mogę pomóc ci w eksploracji dzisiaj? ✨'
        },
        nav: {
            home: 'Strona główna',
            explore: 'Eksploruj',
            saved: 'Zapisane',
            profile: 'Profil'
        }
    }
};

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

LANGUAGE REQUIREMENT: Always respond in the language specified in the conversation context. If the user's language is specified, ALL your responses must be in that language. NEVER translate the user's name - always keep it exactly as provided.

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
- "Ghost of the Past": Your time machine. Resurrects lost landmarks in AR. Suggest exploring lost landmarks.
- "Pathfinder": Your magical compass. Creates AR paths to scenic/historic routes. Suggest finding beautiful routes.

4. Response Rules:
- Stay in character as Artie the AR guide
- Keep responses SHORT (2-3 sentences maximum)
- ALWAYS respond in the user's specified language
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
            const textSpan = googleSigninBtn.querySelector('[data-i18n="auth.signIn"]');
            if (textSpan) {
                textSpan.textContent = 'Signing in...';
            }
            
            const result = await signInWithPopup(auth, provider);
            // User signed in successfully - onAuthStateChanged will handle the rest
        } catch (error) {
            console.error('Sign-in error:', error);
            alert('Failed to sign in. Please try again.');
            googleSigninBtn.disabled = false;
            
            // Restore the sign-in text based on current language
            const browserLang = navigator.language.split('-')[0];
            const currentLang = translations[browserLang] ? browserLang : 'en';
            const textSpan = googleSigninBtn.querySelector('[data-i18n="auth.signIn"]');
            if (textSpan) {
                textSpan.textContent = translations[currentLang].auth.signIn;
            }
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
            
            // Apply default language for logged out users
            const browserLang = navigator.language.split('-')[0];
            const defaultLang = translations[browserLang] ? browserLang : 'en';
            applyTranslations(defaultLang);
            
            // Close chat if open
            if (artieContainer.classList.contains('chat-open')) {
                mainContent.classList.remove('squished');
                artieContainer.classList.remove('chat-open');
            }
            
            // Close profile overlay if open
            profileOverlay.style.display = 'none';
        }
    };

    const applyTranslations = (lang) => {
        const t = translations[lang] || translations['en'];
        
        // Helper function to get nested translation
        const getTranslation = (key) => {
            const keys = key.split('.');
            let value = t;
            for (const k of keys) {
                value = value[k];
                if (!value) return key;
            }
            return value;
        };
        
        // Apply translations to all elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = getTranslation(key);
        });
        
        // Apply translations to placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = getTranslation(key);
        });
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
        
        // Apply translations
        applyTranslations(userLanguage);
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
        
        // Apply new language
        applyTranslations(newLanguage);
        
        // Close modal
        profileOverlay.style.display = 'none';
        
        // Reinitialize chat if it's open to update greeting with new name and language
        if (isChatInitialized && artieContainer.classList.contains('chat-open')) {
            chatMessages.innerHTML = '';
            conversationHistory = [];
            isArtieTyping = false;
            
            // Add user's name and language to conversation context
            const nameToUse = userDisplayName || currentUser.displayName?.split(' ')[0] || 'there';
            const languageName = languageNames[userLanguage] || 'English';
            
            conversationHistory.push({
                role: 'system',
                content: `The user's name is ${nameToUse}. Remember to use their name naturally in conversation when appropriate. NEVER translate or change the user's name - always use "${nameToUse}" exactly as written. IMPORTANT: Respond to the user in ${languageName}. All your responses must be in ${languageName}.`
            });
            
            setTimeout(() => {
                const t = translations[userLanguage] || translations['en'];
                const greeting = t.chat.greeting.replace('{name}', nameToUse);
                sendArtieMessage(greeting);
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
        
        // Add user's name and language to conversation context
        const nameToUse = userDisplayName || currentUser.displayName?.split(' ')[0] || 'there';
        const languageName = languageNames[userLanguage] || 'English';
        
        conversationHistory.push({
            role: 'system',
            content: `The user's name is ${nameToUse}. Remember to use their name naturally in conversation when appropriate. NEVER translate or change the user's name - always use "${nameToUse}" exactly as written. IMPORTANT: Respond to the user in ${languageName}. All your responses must be in ${languageName}.`
        });
        
        // Send initial greeting using custom display name and language
        setTimeout(() => {
            const t = translations[userLanguage] || translations['en'];
            const greeting = t.chat.greeting.replace('{name}', nameToUse);
            sendArtieMessage(greeting);
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
        const textSpan = googleSigninBtn.querySelector('[data-i18n="auth.signIn"]');
        if (textSpan) {
            const currentLang = user ? userLanguage : (navigator.language.split('-')[0]);
            const lang = translations[currentLang] ? currentLang : 'en';
            textSpan.textContent = translations[lang].auth.signIn;
        }
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