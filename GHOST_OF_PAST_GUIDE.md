# Ghost of the Past - Implementation Guide

## Overview
The Ghost of the Past mode has been successfully implemented with the following features:

### Features Implemented
1. **Interactive Map** - Using MapLibre GL with OpenFreeMap tiles
2. **Monument Markers** - Custom styled markers on the map showing monument locations
3. **Search Functionality** - Real-time search to filter monuments
4. **Monument Tiles** - Scrollable grid of monument cards below the map
5. **Navigation** - Clicking on tiles or markers redirects to Vectary AR experience

## File Structure
```
artifact-app/
├── ghost-of-past.html     # Main page for Ghost of the Past mode
├── ghost-of-past.css      # Styles for the page
├── ghost-of-past.js       # JavaScript logic and map initialization
└── monuments/             # Directory for monument images
    └── README.md          # Instructions for adding monument images
```

## Testing the Application

### Method 1: Python HTTP Server (Recommended)
```bash
# Navigate to the project directory
cd "C:\Users\Юрій\Desktop\Blender Projects\ARtifact\artifact-app"

# Start a local server
python -m http.server 8080
```
Then open http://localhost:8080 in your browser.

### Method 2: Using VS Code Live Server
If you have VS Code with Live Server extension, right-click on `index.html` and select "Open with Live Server".

## Customization Guide

### 1. Adding Real Monument Data
Edit `ghost-of-past.js` and update the `monuments` array:
```javascript
const monuments = [
    {
        id: 1,
        name: "Your Monument Name",
        lat: 50.0874,  // Latitude
        lng: 14.4212,  // Longitude
        distance: "0.5 km",
        image: "monuments/your-image.jpg",
        vectaryUrl: "https://app.vectary.com/p/YOUR_VECTARY_ID"
    },
    // Add more monuments...
];
```

### 2. Adding Monument Images
1. Add your monument photos to the `/monuments/` directory
2. Use the filenames specified in the monuments array
3. Recommended format: JPG, 300x200px minimum

### 3. Updating Map Center
To center the map on your location, edit line 71 in `ghost-of-past.js`:
```javascript
center: [longitude, latitude], // Your coordinates
```

### 4. Customizing Styles
- Colors and theme: Edit CSS variables in `ghost-of-past.css`
- Map style: Change the style URL in `ghost-of-past.js` (line 69)

## Features Details

### Map Controls
- **Zoom**: Mouse wheel or pinch gesture
- **Navigation**: Drag to pan
- **Location**: GPS button to center on user location

### Search
- Type in the search bar to filter monuments
- Both map markers and tiles update in real-time

### Mobile Optimized
- Responsive design for screens up to 430px
- Touch-friendly interface
- Optimized map controls for mobile

## Next Steps
1. Add real monument images to `/monuments/` directory
2. Update monument data with actual locations
3. Create unique Vectary experiences for each monument
4. Test on mobile devices
5. Consider adding user location-based distance calculation

## Troubleshooting
- If images don't load: Check file paths and names match exactly
- If map doesn't show: Ensure you're running from a web server (not file://)
- For CORS issues: Use a local web server as described above
