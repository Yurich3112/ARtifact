// Firebase configuration (reuse from main app)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

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

// Sample route data
const routes = [
    {
        id: 1,
        emoji: "⭐",
        distance: "2.3km",
        duration: "1.5h",
        rating: "4.9",
        category: "nearby",
        vectaryUrl: "https://app.vectary.com/p/2xRRu5tHD3dk56TEvCMntY"
    },
    {
        id: 2,
        emoji: "🏰",
        distance: "1.8km",
        duration: "2h",
        rating: "4.8",
        category: "popular",
        vectaryUrl: "https://app.vectary.com/p/2xRRu5tHD3dk56TEvCMntY"
    },
    {
        id: 3,
        emoji: "🌉",
        distance: "1.5km",
        duration: "1h",
        rating: "4.9",
        category: "nearby",
        vectaryUrl: "https://app.vectary.com/p/2xRRu5tHD3dk56TEvCMntY"
    },
    {
        id: 4,
        emoji: "🎨",
        distance: "2.0km",
        duration: "2.5h",
        rating: "4.7",
        category: "popular",
        vectaryUrl: "https://app.vectary.com/p/2xRRu5tHD3dk56TEvCMntY"
    },
    {
        id: 5,
        emoji: "🏛️",
        distance: "1.2km",
        duration: "1h",
        rating: "4.6",
        category: "nearby",
        vectaryUrl: "https://app.vectary.com/p/2xRRu5tHD3dk56TEvCMntY"
    },
    {
        id: 6,
        emoji: "⛪",
        distance: "2.1km",
        duration: "1.5h",
        rating: "4.9",
        category: "popular",
        vectaryUrl: "https://app.vectary.com/p/2xRRu5tHD3dk56TEvCMntY"
    },
    {
        id: 7,
        emoji: "🏛️",
        distance: "3.2km",
        duration: "2.5h",
        rating: "5.0",
        category: "popular",
        vectaryUrl: "https://app.vectary.com/p/0pxcWFFfppQnA4NoZz64RL"
    }
];

// Global state
let currentUser = null;
let currentFilter = 'nearby';
let savedProgress = null;
let currentLanguage = 'en';

// Translations (copied from script.js for pathfinder page)
const translations = {
    en: {
        pathfinder: {
            title: 'Pathfinder',
            greeting: 'Hello',
            guest: 'Guest',
            subtitle: 'Where shall we journey today?',
            artieSuggestion: "ARtie's Suggestion",
            suggestionText: "I see you're in Prague! There's a wonderful route through the Old Town with incredible historical landmarks nearby. Want to try?",
            startRoute: 'Start',
            askMore: 'Ask More',
            nearby: 'Nearby',
            popular: 'Popular',
            custom: 'Custom',
            recommendedRoutes: '🌟 Recommended Routes',
            showAll: 'Show all routes',
            orAskArtie: '💬 Or ask ARtie',
            artieChatDesc: 'Create your own route with me',
            openChat: 'Open chat',
            resumeJourney: '🔄 Resume Journey',
            continue: 'Continue',
            points: 'points'
        },
        routes: {
            1: { title: 'Prague Old Town', description: 'Explore the historic heart of Prague' },
            2: { title: 'Prague Castle', description: 'Visit the iconic Prague Castle complex' },
            3: { title: 'Charles Bridge', description: 'Walk across the famous Charles Bridge' },
            4: { title: 'Jewish Quarter', description: "Discover the Jewish Quarter's rich history" },
            5: { title: 'Wenceslas Square', description: 'Experience the bustling Wenceslas Square' },
            6: { title: 'St. Vitus Cathedral', description: 'Marvel at St. Vitus Cathedral' },
            7: { title: 'Colosseum', description: 'Explore the iconic Colosseum and ancient Rome' }
        },
        nav: { home: 'Home', explore: 'Explore', saved: 'Saved', profile: 'Profile' }
    },
    uk: {
        pathfinder: {
            title: 'Провідник',
            greeting: 'Привіт',
            guest: 'Гість',
            subtitle: 'Куди подорожуємо сьогодні?',
            artieSuggestion: 'Пропозиція від ARtie',
            suggestionText: 'Я бачу, ти в Празі! Поблизу є чудовий маршрут по Старому Місту з неймовірними історичними пам\'ятками. Хочеш спробувати?',
            startRoute: 'Розпочати',
            askMore: 'Запитати',
            nearby: 'Поблизу',
            popular: 'Популярні',
            custom: 'Власні',
            recommendedRoutes: '🌟 Рекомендовані маршрути',
            showAll: 'Показати всі маршрути',
            orAskArtie: '💬 Або запитай ARtie',
            artieChatDesc: 'Створи власний маршрут разом зі мною',
            openChat: 'Відкрити чат',
            resumeJourney: '🔄 Продовжити подорож',
            continue: 'Продовжити',
            points: 'точок'
        },
        routes: {
            1: { title: 'Старе Місто Праги', description: 'Дослідіть історичне серце Праги' },
            2: { title: 'Празький Град', description: 'Відвідайте знаменитий комплекс Празького Граду' },
            3: { title: 'Карлів міст', description: 'Прогуляйтеся знаменитим Карловим мостом' },
            4: { title: 'Єврейський квартал', description: 'Відкрийте для себе багату історію Єврейського кварталу' },
            5: { title: 'Вацлавська площа', description: 'Відчуйте жваву атмосферу Вацлавської площі' },
            6: { title: 'Собор Святого Віта', description: 'Помилуйтеся собором Святого Віта' },
            7: { title: 'Колізей', description: 'Дослідіть легендарний Колізей та стародавній Рим' }
        },
        nav: { home: 'Головна', explore: 'Огляд', saved: 'Збережене', profile: 'Профіль' }
    },
    es: {
        pathfinder: {
            title: 'Explorador',
            greeting: 'Hola',
            guest: 'Invitado',
            subtitle: '¿A dónde viajamos hoy?',
            artieSuggestion: 'Sugerencia de ARtie',
            suggestionText: '¡Veo que estás en Praga! Hay una ruta maravillosa por el Casco Antiguo con increíbles monumentos históricos cerca. ¿Quieres probar?',
            startRoute: 'Comenzar',
            askMore: 'Preguntar',
            nearby: 'Cerca',
            popular: 'Popular',
            custom: 'Personal',
            recommendedRoutes: '🌟 Rutas recomendadas',
            showAll: 'Mostrar todas las rutas',
            orAskArtie: '💬 O pregunta a ARtie',
            artieChatDesc: 'Crea tu propia ruta conmigo',
            openChat: 'Abrir chat',
            resumeJourney: '🔄 Continuar viaje',
            continue: 'Continuar',
            points: 'puntos'
        },
        routes: {
            1: { title: 'Casco Antiguo de Praga', description: 'Explora el corazón histórico de Praga' },
            2: { title: 'Castillo de Praga', description: 'Visita el icónico complejo del Castillo de Praga' },
            3: { title: 'Puente de Carlos', description: 'Cruza el famoso Puente de Carlos' },
            4: { title: 'Barrio Judío', description: 'Descubre la rica historia del Barrio Judío' },
            5: { title: 'Plaza de Wenceslao', description: 'Experimenta la bulliciosa Plaza de Wenceslao' },
            6: { title: 'Catedral de San Vito', description: 'Maravíllate con la Catedral de San Vito' },
            7: { title: 'Coliseo', description: 'Explora el icónico Coliseo y la antigua Roma' }
        },
        nav: { home: 'Inicio', explore: 'Explorar', saved: 'Guardado', profile: 'Perfil' }
    },
    fr: {
        pathfinder: {
            title: 'Éclaireur',
            greeting: 'Bonjour',
            guest: 'Invité',
            subtitle: 'Où voyageons-nous aujourd\'hui ?',
            artieSuggestion: 'Suggestion d\'ARtie',
            suggestionText: 'Je vois que vous êtes à Prague ! Il y a un merveilleux itinéraire dans la Vieille Ville avec d\'incroyables monuments historiques à proximité. Voulez-vous essayer ?',
            startRoute: 'Commencer',
            askMore: 'Demander',
            nearby: 'À proximité',
            popular: 'Populaire',
            custom: 'Personnalisé',
            recommendedRoutes: '🌟 Itinéraires recommandés',
            showAll: 'Afficher tous les itinéraires',
            orAskArtie: '💬 Ou demandez à ARtie',
            artieChatDesc: 'Créez votre propre itinéraire avec moi',
            openChat: 'Ouvrir le chat',
            resumeJourney: '🔄 Reprendre le voyage',
            continue: 'Continuer',
            points: 'points'
        },
        routes: {
            1: { title: 'Vieille Ville de Prague', description: 'Explorez le cœur historique de Prague' },
            2: { title: 'Château de Prague', description: 'Visitez l\'emblématique complexe du Château de Prague' },
            3: { title: 'Pont Charles', description: 'Traversez le célèbre Pont Charles' },
            4: { title: 'Quartier Juif', description: 'Découvrez la riche histoire du Quartier Juif' },
            5: { title: 'Place Venceslas', description: 'Découvrez l\'animation de la Place Venceslas' },
            6: { title: 'Cathédrale Saint-Guy', description: 'Admirez la Cathédrale Saint-Guy' },
            7: { title: 'Colisée', description: 'Explorez l\'emblématique Colisée et la Rome antique' }
        },
        nav: { home: 'Accueil', explore: 'Explorer', saved: 'Enregistré', profile: 'Profil' }
    },
    de: {
        pathfinder: {
            title: 'Pfadfinder',
            greeting: 'Hallo',
            guest: 'Gast',
            subtitle: 'Wohin reisen wir heute?',
            artieSuggestion: 'ARties Vorschlag',
            suggestionText: 'Ich sehe, du bist in Prag! Es gibt eine wunderbare Route durch die Altstadt mit unglaublichen historischen Sehenswürdigkeiten in der Nähe. Möchtest du es versuchen?',
            startRoute: 'Starten',
            askMore: 'Fragen',
            nearby: 'In der Nähe',
            popular: 'Beliebt',
            custom: 'Benutzerdefiniert',
            recommendedRoutes: '🌟 Empfohlene Routen',
            showAll: 'Alle Routen anzeigen',
            orAskArtie: '💬 Oder frag ARtie',
            artieChatDesc: 'Erstelle deine eigene Route mit mir',
            openChat: 'Chat öffnen',
            resumeJourney: '🔄 Reise fortsetzen',
            continue: 'Fortsetzen',
            points: 'Punkte'
        },
        routes: {
            1: { title: 'Prager Altstadt', description: 'Erkunden Sie das historische Herz von Prag' },
            2: { title: 'Prager Burg', description: 'Besuchen Sie den legendären Prager Burg-Komplex' },
            3: { title: 'Karlsbrücke', description: 'Überqueren Sie die berühmte Karlsbrücke' },
            4: { title: 'Jüdisches Viertel', description: 'Entdecken Sie die reiche Geschichte des Jüdischen Viertels' },
            5: { title: 'Wenzelsplatz', description: 'Erleben Sie den lebhaften Wenzelsplatz' },
            6: { title: 'Veitsdom', description: 'Bewundern Sie den Veitsdom' },
            7: { title: 'Kolosseum', description: 'Erkunden Sie das legendäre Kolosseum und das antike Rom' }
        },
        nav: { home: 'Startseite', explore: 'Erkunden', saved: 'Gespeichert', profile: 'Profil' }
    },
    it: {
        pathfinder: {
            title: 'Esploratore',
            greeting: 'Ciao',
            guest: 'Ospite',
            subtitle: 'Dove viaggiamo oggi?',
            artieSuggestion: 'Suggerimento di ARtie',
            suggestionText: 'Vedo che sei a Praga! C\'è un meraviglioso percorso attraverso il Centro Storico con incredibili monumenti storici nelle vicinanze. Vuoi provare?',
            startRoute: 'Inizia',
            askMore: 'Chiedi',
            nearby: 'Vicino',
            popular: 'Popolare',
            custom: 'Personalizzato',
            recommendedRoutes: '🌟 Percorsi consigliati',
            showAll: 'Mostra tutti i percorsi',
            orAskArtie: '💬 Oppure chiedi ad ARtie',
            artieChatDesc: 'Crea il tuo percorso con me',
            openChat: 'Apri chat',
            resumeJourney: '🔄 Riprendi viaggio',
            continue: 'Continua',
            points: 'punti'
        },
        routes: {
            1: { title: 'Centro Storico di Praga', description: 'Esplora il cuore storico di Praga' },
            2: { title: 'Castello di Praga', description: 'Visita l\'iconico complesso del Castello di Praga' },
            3: { title: 'Ponte Carlo', description: 'Attraversa il famoso Ponte Carlo' },
            4: { title: 'Quartiere Ebraico', description: 'Scopri la ricca storia del Quartiere Ebraico' },
            5: { title: 'Piazza Venceslao', description: 'Vivi l\'animazione di Piazza Venceslao' },
            6: { title: 'Cattedrale di San Vito', description: 'Ammira la Cattedrale di San Vito' },
            7: { title: 'Colosseo', description: 'Esplora l\'iconico Colosseo e l\'antica Roma' }
        },
        nav: { home: 'Home', explore: 'Esplora', saved: 'Salvati', profile: 'Profilo' }
    },
    cs: {
        pathfinder: {
            title: 'Průzkumník',
            greeting: 'Ahoj',
            guest: 'Host',
            subtitle: 'Kam dnes cestujeme?',
            artieSuggestion: 'Návrh od ARtie',
            suggestionText: 'Vidím, že jsi v Praze! V blízkosti je nádherná trasa po Starém Městě s neuvěřitelnými historickými památkami. Chceš to zkusit?',
            startRoute: 'Začít',
            askMore: 'Zeptat se',
            nearby: 'V okolí',
            popular: 'Oblíbené',
            custom: 'Vlastní',
            recommendedRoutes: '🌟 Doporučené trasy',
            showAll: 'Zobrazit všechny trasy',
            orAskArtie: '💬 Nebo se zeptej ARtie',
            artieChatDesc: 'Vytvoř si vlastní trasu se mnou',
            openChat: 'Otevřít chat',
            resumeJourney: '🔄 Pokračovat v cestě',
            continue: 'Pokračovat',
            points: 'bodů'
        },
        routes: {
            1: { title: 'Pražské Staré Město', description: 'Prozkoumejte historické centrum Prahy' },
            2: { title: 'Pražský hrad', description: 'Navštivte ikonický komplex Pražského hradu' },
            3: { title: 'Karlův most', description: 'Projděte se po slavném Karlově mostě' },
            4: { title: 'Židovská čtvrť', description: 'Objevte bohatou historii Židovské čtvrti' },
            5: { title: 'Václavské náměstí', description: 'Zažijte rušné Václavské náměstí' },
            6: { title: 'Katedrála svatého Víta', description: 'Obdivujte katedrálu svatého Víta' },
            7: { title: 'Koloseum', description: 'Prozkoumejte ikonické Koloseum a starověký Řím' }
        },
        nav: { home: 'Domů', explore: 'Prozkoumat', saved: 'Uložené', profile: 'Profil' }
    },
    pl: {
        pathfinder: {
            title: 'Tropiciel',
            greeting: 'Cześć',
            guest: 'Gość',
            subtitle: 'Dokąd dzisiaj podróżujemy?',
            artieSuggestion: 'Sugestia ARtie',
            suggestionText: 'Widzę, że jesteś w Pradze! W pobliżu jest wspaniała trasa przez Stare Miasto z niesamowitymi zabytkami historycznymi. Chcesz spróbować?',
            startRoute: 'Rozpocznij',
            askMore: 'Zapytaj',
            nearby: 'W pobliżu',
            popular: 'Popularne',
            custom: 'Własne',
            recommendedRoutes: '🌟 Polecane trasy',
            showAll: 'Pokaż wszystkie trasy',
            orAskArtie: '💬 Lub zapytaj ARtie',
            artieChatDesc: 'Stwórz własną trasę ze mną',
            openChat: 'Otwórz czat',
            resumeJourney: '🔄 Kontynuuj podróż',
            continue: 'Kontynuuj',
            points: 'punktów'
        },
        routes: {
            1: { title: 'Stare Miasto Pragi', description: 'Poznaj historyczne serce Pragi' },
            2: { title: 'Zamek Praski', description: 'Odwiedź ikoniczny kompleks Zamku Praskiego' },
            3: { title: 'Most Karola', description: 'Przejdź słynnym Mostem Karola' },
            4: { title: 'Dzielnica Żydowska', description: 'Odkryj bogatą historię Dzielnicy Żydowskiej' },
            5: { title: 'Plac Wacława', description: 'Doświadcz tętniącego życiem Placu Wacława' },
            6: { title: 'Katedra św. Wita', description: 'Podziwiaj Katedrę św. Wita' },
            7: { title: 'Koloseum', description: 'Poznaj ikoniczne Koloseum i starożytny Rzym' }
        },
        nav: { home: 'Strona główna', explore: 'Eksploruj', saved: 'Zapisane', profile: 'Profil' }
    }
};

// Translation cache to avoid re-rendering
let translationCache = {
    lastLanguage: null,
    lastRenderedHTML: null
};

// Language helpers
function detectBrowserLanguage() {
    const browserLang = navigator.language.split('-')[0].toLowerCase();
    if (browserLang === 'ua') return 'uk';
    return translations[browserLang] ? browserLang : 'en';
}

function resolveLanguage(lang) {
    return lang === 'auto' ? detectBrowserLanguage() : lang;
}

function applyTranslations(lang) {
    // Resolve language (handle 'auto' case)
    const resolved = lang === 'auto' ? detectBrowserLanguage() : lang;
    
    // Always update currentLanguage
    currentLanguage = resolved;
    
    // Check cache - if language hasn't changed, skip re-rendering static content
    if (translationCache.lastLanguage === resolved && translationCache.lastRenderedHTML) {
        console.log('Pathfinder: Using cached translations for language:', resolved);
        // Always re-render routes since they're dynamic and may have changed
        renderRoutes(currentFilter);
        return;
    }
    
    console.log('Pathfinder: Applying translations for resolved language:', resolved);
    
    const t = translations[resolved] || translations['en'];
    
    if (!t) {
        console.error('Pathfinder: No translations found for language:', resolved);
        return;
    }
    
    // Helper function to get nested translation
    const getTranslation = (key) => {
        const keys = key.split('.');
        let value = t;
        for (const k of keys) {
            value = value[k];
            if (!value) {
                console.warn('Pathfinder: Translation not found for key:', key);
                return key;
            }
        }
        return value;
    };
    
    // Apply translations to all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = getTranslation(key);
        if (translation && translation !== key) {
            el.textContent = translation;
        }
    });
    
    // Apply translations to placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translation = getTranslation(key);
        if (translation && translation !== key) {
            el.placeholder = translation;
        }
    });
    
    // Update dynamic content
    updateDynamicContent(t);
    
    // Update ARtie suggestion text
    const suggestionEl = document.getElementById('artie-suggestion-text');
    if (suggestionEl && t.pathfinder?.suggestionText) {
        suggestionEl.textContent = `"${t.pathfinder.suggestionText}"`;
    }
    
    // Re-render routes to update button labels
    renderRoutes(currentFilter);
    
    // Update resume section with translated route name
    if (savedProgress) {
        showResumeSection();
    }
    
    // Update cache after all translations are applied
    translationCache.lastLanguage = resolved;
    translationCache.lastRenderedHTML = document.documentElement.innerHTML;
}

function updateDynamicContent(t) {
    // Update greeting with user name will be handled by updateUserInfo
    // This function can be used for other dynamic content updates if needed
}

function loadTranslations() {
    // Get user's language preference
    let lang = null;
    
    // Priority 1: Check if current user has saved language preference
    if (currentUser) {
        const savedLanguage = localStorage.getItem(`language_${currentUser.uid}`);
        if (savedLanguage) {
            lang = savedLanguage;
            console.log('Pathfinder: Found user language preference:', lang);
        }
    }
    
    // Priority 2: If no user-specific language, check all users' preferences
    if (!lang || lang === 'auto') {
        const allKeys = Object.keys(localStorage);
        for (const key of allKeys) {
            if (key.startsWith('language_')) {
                const userLang = localStorage.getItem(key);
                if (userLang && userLang !== 'auto') {
                    lang = userLang;
                    console.log('Pathfinder: Found any user language preference:', lang);
                    break;
                }
            }
        }
    }
    
    // Priority 3: If still no language or 'auto', use browser language
    if (!lang || lang === 'auto') {
        lang = detectBrowserLanguage();
        console.log('Pathfinder: Using browser language:', lang);
    }
    
    // Apply translations
    console.log('Pathfinder: Final language to apply:', lang);
    applyTranslations(lang);
}

document.addEventListener('DOMContentLoaded', () => {
    initializePathfinderApp();
    setupEventListeners();
    
    // Listen for language changes from other pages/settings
    window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith('language_')) {
            console.log('Pathfinder: Language changed in storage, invalidating cache and reloading translations');
            // Invalidate cache when language changes externally
            translationCache.lastLanguage = null;
            translationCache.lastRenderedHTML = null;
            loadTranslations();
        }
    });
    
    // Also check language when window gains focus (user returns from settings page)
    window.addEventListener('focus', () => {
        console.log('Pathfinder: Window focused, checking for language changes');
        // Invalidate cache to force reload on focus
        translationCache.lastLanguage = null;
        translationCache.lastRenderedHTML = null;
        loadTranslations();
    });
});

function initializePathfinderApp() {
    // Load translations immediately (for logged out users or before auth loads)
    // This will use browser language or any saved preference
    loadTranslations();
    
    // Check authentication state
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        updateUserInfo(user);
        updateUserAvatar(user);
        
        // Reload translations AFTER user is loaded (to get user's language preference)
        // This ensures we use the correct user's saved language
        setTimeout(() => {
            loadTranslations();
            
            // Hide loading screen after translations are applied
            hideLoadingScreen();
        }, 100);
    });

    // Load user location (mock for now)
    getUserLocation();

    // Load saved progress if any
    loadSavedProgress();

    // Render initial routes (will be re-rendered after translations load)
    renderRoutes(currentFilter);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        // Remove from DOM after animation completes
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 300);
    }
}

function updateUserInfo(user) {
    const userNameEl = document.getElementById('user-name');
    if (user) {
        // Try to get custom display name from localStorage
        const savedName = localStorage.getItem(`displayName_${user.uid}`);
        const displayName = savedName || user.displayName?.split(' ')[0] || 'User';
        userNameEl.textContent = displayName;
    } else {
        // Use translation for "Guest" - fallback to English if translations not loaded yet
        const t = translations[currentLanguage] || translations['en'];
        userNameEl.textContent = t.pathfinder.guest || 'Guest';
    }
}

function updateUserAvatar(user) {
    const userAvatar = document.getElementById('user-avatar');
    const profileIconDefault = document.querySelector('.profile-icon-default');
    
    if (user && user.photoURL) {
        userAvatar.src = user.photoURL;
        userAvatar.style.display = 'block';
        if (profileIconDefault) {
            profileIconDefault.style.display = 'none';
        }
    } else {
        userAvatar.style.display = 'none';
        if (profileIconDefault) {
            profileIconDefault.style.display = 'block';
        }
    }
}

function getUserLocation() {
    // Try to get user's actual location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Could use reverse geocoding here to get city name
                // For now, keeping Prague as default
                updateLocationDisplay('Prague');
            },
            (error) => {
                console.log('Location access denied, using default');
                updateLocationDisplay('Prague');
            }
        );
    } else {
        updateLocationDisplay('Prague');
    }
}

function updateLocationDisplay(location) {
    const locationEl = document.getElementById('user-location');
    locationEl.textContent = location;
}

function loadSavedProgress() {
    // Check localStorage for saved journey
    const saved = localStorage.getItem('currentJourney');
    if (saved) {
        savedProgress = JSON.parse(saved);
        showResumeSection();
    }
}

function showResumeSection() {
    const resumeSection = document.getElementById('resume-section');
    const routeNameEl = document.getElementById('resume-route-name');
    const progressEl = document.getElementById('resume-progress');
    
    if (savedProgress) {
        resumeSection.style.display = 'block';
        
        // Get translated route name
        const t = translations[currentLanguage] || translations['en'];
        const routeId = savedProgress.routeId || 1;
        const route = routes.find(r => r.id === routeId);
        
        if (route && t.routes[route.id]) {
            const translatedName = `${route.emoji} ${t.routes[route.id].title}`;
            routeNameEl.textContent = translatedName;
        } else {
            routeNameEl.textContent = savedProgress.routeName || 'Route';
        }
        
        // Use translated "points" text
        const pointsText = t.pathfinder.points || 'points';
        progressEl.textContent = `${savedProgress.currentPoint}/${savedProgress.totalPoints} ${pointsText}`;
    }
}

function renderRoutes(filter = 'nearby', showAll = false) {
    const routesList = document.getElementById('routes-list');
    const showAllBtn = document.getElementById('show-all-btn');
    
    // Get current translation for button text and route details
    const t = translations[currentLanguage] || translations['en'];
    const startButtonText = t.pathfinder.startRoute;
    
    // Filter routes based on selected filter
    let filteredRoutes = routes;
    if (filter === 'nearby') {
        filteredRoutes = routes.filter(r => r.category === 'nearby');
    } else if (filter === 'popular') {
        filteredRoutes = routes.filter(r => r.category === 'popular');
    } else if (filter === 'custom') {
        // Custom routes would come from user's saved routes
        filteredRoutes = routes.slice(0, 2); // Mock: show first 2
    }

    // Limit display to 2 routes unless "show all" is clicked
    const displayRoutes = showAll ? filteredRoutes : filteredRoutes.slice(0, 2);
    
    // Show/hide "Show all" button based on number of routes
    if (filteredRoutes.length > 2 && !showAll) {
        showAllBtn.style.display = 'flex';
    } else {
        showAllBtn.style.display = 'none';
    }
    
    routesList.innerHTML = displayRoutes.map(route => {
        // Get translated title and description
        const routeTranslation = t.routes[route.id] || { title: 'Route', description: '' };
        const translatedTitle = `${route.emoji} ${routeTranslation.title}`;
        
        return `
        <div class="route-card" data-route-id="${route.id}">
            <div class="route-header">
                <div class="route-info">
                    <h4 class="route-title">${translatedTitle}</h4>
                    <div class="route-stats">
                        <span class="stat">
                            <span class="material-symbols-outlined">directions_walk</span>
                            ${route.distance}
                        </span>
                        <span class="stat">
                            <span class="material-symbols-outlined">schedule</span>
                            ${route.duration}
                        </span>
                        <span class="stat">
                            <span class="material-symbols-outlined">star</span>
                            ${route.rating}
                        </span>
                    </div>
                </div>
            </div>
            <button class="route-card-btn" data-vectary-url="${route.vectaryUrl}">
                ${startButtonText}
                <span class="material-symbols-outlined">arrow_forward</span>
            </button>
        </div>
    `;
    }).join('');

    // Add click handlers to route cards and buttons
    attachRouteHandlers();
}

function attachRouteHandlers() {
    const routeCards = document.querySelectorAll('.route-card');
    routeCards.forEach(card => {
        const btn = card.querySelector('.route-card-btn');
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const vectaryUrl = btn.getAttribute('data-vectary-url');
            const routeId = card.getAttribute('data-route-id');
            startRoute(routeId, vectaryUrl);
        });
    });
}

function startRoute(routeId, vectaryUrl) {
    const route = routes.find(r => r.id == routeId);
    if (route) {
        // Save journey start
        const journey = {
            routeId: parseInt(routeId),
            currentPoint: 0,
            totalPoints: 5,
            startedAt: new Date().toISOString()
        };
        localStorage.setItem('currentJourney', JSON.stringify(journey));
        
        // Navigate to Vectary
        window.location.href = vectaryUrl;
    }
}

function setupEventListeners() {
    // Quick action filters
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            quickActionBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Get filter value
            const filter = btn.getAttribute('data-filter');
            currentFilter = filter;
            
            // Re-render routes
            renderRoutes(filter, false);
        });
    });

    // Show all button
    const showAllBtn = document.getElementById('show-all-btn');
    showAllBtn.addEventListener('click', () => {
        renderRoutes(currentFilter, true);
    });

    // Start suggestion button
    const startSuggestionBtn = document.getElementById('start-suggestion-btn');
    startSuggestionBtn.addEventListener('click', () => {
        // Start the first recommended route
        const firstRoute = routes.find(r => r.category === currentFilter);
        if (firstRoute) {
            startRoute(firstRoute.id, firstRoute.vectaryUrl);
        }
    });

    // Ask ARtie button (in suggestion widget)
    const askArtieBtn = document.getElementById('ask-artie-btn');
    askArtieBtn.addEventListener('click', () => {
        // Navigate back to home and open chat
        window.location.href = 'index.html?openChat=true';
    });

    // Open chat button
    const openChatBtn = document.getElementById('open-chat-btn');
    openChatBtn.addEventListener('click', () => {
        // Navigate back to home and open chat
        window.location.href = 'index.html?openChat=true';
    });

    // Resume button
    const resumeBtn = document.getElementById('resume-btn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            if (savedProgress) {
                // Find the route and navigate
                const route = routes.find(r => r.id == savedProgress.routeId);
                if (route) {
                    window.location.href = route.vectaryUrl;
                }
            }
        });
    }

    // Settings button
    const settingsBtn = document.querySelector('.settings-button');
    settingsBtn.addEventListener('click', () => {
        // Could open a settings modal or navigate to settings page
        alert('Settings feature coming soon!');
    });

    // Bottom nav profile item
    const profileNavItem = document.getElementById('profile-nav-item');
    profileNavItem.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentUser) {
            // Navigate to profile page or show profile modal
            window.location.href = 'index.html#profile';
        } else {
            // Redirect to login
            window.location.href = 'index.html';
        }
    });
}

// Check if we should open chat on load (from query parameter)
if (window.location.search.includes('openChat=true')) {
    // This will be handled by the main index.html page
    window.location.href = 'index.html?openChat=true';
}
