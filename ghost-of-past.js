// Sample monument data
// Note: Replace these with actual monument data for your location
// Add monument images to the /monuments/ directory
const monuments = [
    {
        id: 1,
        name: "New Synagogue in Opole",
        lat: 50.66639,
        lng: 17.92083,
        distance: "1.1 km",
        image: "monuments/opole-synagogue.jpg", // Add your image to monuments folder
        vectaryUrl: "https://app.vectary.com/p/2xRRu5tHD3dk56TEvCMntY"
    },
    {
        id: 2,
        name: "Ancient Castle Ruins",
        lat: 50.0874,
        lng: 14.4212,
        distance: "0.5 km",
        image: "monuments/castle-ruins.jpg" // Add your image to monuments folder
    },
    {
        id: 3,
        name: "Historic Town Square",
        lat: 50.0755,
        lng: 14.4378,
        distance: "1.2 km",
        image: "monuments/town-square.jpg" // Add your image to monuments folder
    },
    {
        id: 4,
        name: "Old Cathedral",
        lat: 50.0903,
        lng: 14.4006,
        distance: "0.8 km",
        image: "monuments/cathedral.jpg" // Add your image to monuments folder
    },
    {
        id: 5,
        name: "Medieval Bridge",
        lat: 50.0865,
        lng: 14.4114,
        distance: "0.3 km",
        image: "monuments/bridge.jpg" // Add your image to monuments folder
    },
    {
        id: 6,
        name: "Royal Palace Gardens",
        lat: 50.0891,
        lng: 14.4033,
        distance: "0.6 km",
        image: "monuments/palace-gardens.jpg" // Add your image to monuments folder
    },
    {
        id: 7,
        name: "Ancient Tower",
        lat: 50.0827,
        lng: 14.4195,
        distance: "0.9 km",
        image: "monuments/tower.jpg" // Add your image to monuments folder
    }
];

// Initialize the map
let map;
let markers = [];

document.addEventListener('DOMContentLoaded', () => {
    // Apply saved language preference if available
    applyLanguagePreference();
    
    initializeMap();
    renderMonumentTiles();
    setupSearch();
    
    // Fallback: Hide loading screen after max 7 seconds if map doesn't load
    setTimeout(() => {
        hideLoadingScreen();
    }, 7000);
});

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

// Apply language preference from parent app
function applyLanguagePreference() {
    // Try to get language preference from localStorage (from main app)
    const savedLanguage = localStorage.getItem('appLanguage') || 'auto';
    
    if (savedLanguage !== 'auto' && savedLanguage !== 'en') {
        // Load translations from parent script if needed
        // For now, we'll keep English as default for the Ghost page
        // Full translation integration can be added later
    }
}

function initializeMap() {
    // Initialize the map with OpenFreeMap tiles
    // Center between Prague and Opole for better overview
    map = new maplibregl.Map({
        container: 'map',
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [16.17, 50.37], // Centered between Prague and Opole
        zoom: 8,
        maxZoom: 18,
        minZoom: 6
    });

    // Add navigation controls
    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add geolocate control
    map.addControl(
        new maplibregl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        }),
        'top-right'
    );

    // Wait for map to load before adding markers
    map.on('load', () => {
        addMonumentMarkers();
        // Hide loading screen after map is fully loaded
        hideLoadingScreen();
    });
    
    // Also hide on error to prevent infinite loading
    map.on('error', (e) => {
        console.error('Map error:', e);
        hideLoadingScreen();
    });
}

function addMonumentMarkers() {
    monuments.forEach(monument => {
        // Create a custom marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'monument-marker';
        markerEl.innerHTML = '<span class="material-symbols-outlined">castle</span>';

        // Create the marker
        const marker = new maplibregl.Marker({
            element: markerEl,
            anchor: 'bottom'
        })
            .setLngLat([monument.lng, monument.lat])
            .addTo(map);

        // Create popup
        const popup = new maplibregl.Popup({
            offset: 25,
            closeButton: false
        }).setHTML(`
            <div class="popup-content">
                <div class="popup-title">${monument.name}</div>
                <div class="popup-distance">${monument.distance}</div>
            </div>
        `);

        // Show popup on hover
        markerEl.addEventListener('mouseenter', () => {
            marker.setPopup(popup).togglePopup();
        });

        markerEl.addEventListener('mouseleave', () => {
            marker.togglePopup();
        });

        // Navigate to Vectary on click (only if URL exists)
        if (monument.vectaryUrl) {
            markerEl.addEventListener('click', () => {
                window.location.href = monument.vectaryUrl;
            });
            markerEl.style.cursor = 'pointer';
        } else {
            markerEl.style.cursor = 'default';
        }

        markers.push({ marker, monument });
    });
}

function renderMonumentTiles(monumentsToRender = monuments) {
    const grid = document.getElementById('monuments-grid');
    
    if (monumentsToRender.length === 0) {
        grid.innerHTML = '<div class="no-results">No monuments found</div>';
        return;
    }

    grid.innerHTML = monumentsToRender.map(monument => {
        const tileContent = `
            <img src="${monument.image}" 
                 alt="${monument.name}" 
                 class="monument-image" 
                 loading="lazy"
                 onerror="this.onerror=null; this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22><rect width=%22300%22 height=%22200%22 fill=%22%23E5E5E5%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-family=%22Arial%22 font-size=%2214%22>Monument Image</text></svg>';">
            <div class="monument-info">
                <h3 class="monument-name">${monument.name}</h3>
                <div class="monument-distance">
                    <span class="material-symbols-outlined">location_on</span>
                    ${monument.distance}
                </div>
            </div>
        `;
        
        // Only make it a link if vectaryUrl exists
        if (monument.vectaryUrl) {
            return `<a href="${monument.vectaryUrl}" class="monument-tile">${tileContent}</a>`;
        } else {
            return `<div class="monument-tile monument-tile-disabled">${tileContent}</div>`;
        }
    }).join('');
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const searchTerm = e.target.value.toLowerCase();

        searchTimeout = setTimeout(() => {
            const filteredMonuments = monuments.filter(monument =>
                monument.name.toLowerCase().includes(searchTerm)
            );

            // Update tiles
            renderMonumentTiles(filteredMonuments);

            // Update marker visibility
            markers.forEach(({ marker, monument }) => {
                const isVisible = monument.name.toLowerCase().includes(searchTerm);
                marker.getElement().style.display = isVisible ? 'flex' : 'none';
            });
        }, 300);
    });
}

// Handle back navigation with browser back button
window.addEventListener('popstate', () => {
    window.location.href = 'index.html';
});
