# Pathfinder - Implementation Guide

## Overview
The Pathfinder mode has been successfully implemented as a comprehensive route exploration and navigation feature.

### Features Implemented

1. **Personalized Greeting**
   - Displays user's name from Firebase auth
   - Shows current location (with geolocation support)
   - Welcomes the user with a personalized message

2. **ARtie's Suggestion Widget**
   - Smart AI-powered route recommendation
   - Quick action buttons to start route or ask questions
   - Contextual suggestions based on location

3. **Quick Action Filters**
   - **Nearby**: Routes close to user's location
   - **Popular**: Most visited routes
   - **Custom**: User's personalized routes
   - Active tab highlighting with smooth transitions

4. **Featured Routes Section**
   - Route cards with detailed information:
     - Route name with emoji
     - Distance (km)
     - Duration (hours)
     - User rating
   - "Show all routes" button to expand list
   - Click to start any route

5. **Chat Entry Point**
   - Direct link to ARtie chatbot
   - Allows users to create custom routes
   - Seamless integration with main app's chat

6. **Resume Journey**
   - Saves progress in localStorage
   - Shows incomplete journeys
   - One-click to resume

7. **Bottom Navigation**
   - Consistent with main app
   - Profile integration with Firebase auth
   - Active state management

## File Structure
```
artifact-app/
├── pathfinder.html     # Main Pathfinder page
├── pathfinder.css      # Styles
├── pathfinder.js       # Logic and interactions
└── script.js           # Updated with Pathfinder translations
```

## Route Data Structure

Routes are defined in `pathfinder.js`:

```javascript
{
    id: 1,
    title: "⭐ Старе Місто Праги",
    emoji: "⭐",
    distance: "2.3km",
    duration: "1.5h",
    rating: "4.9",
    category: "nearby", // or "popular", "custom"
    description: "Explore the historic heart of Prague",
    vectaryUrl: "https://app.vectary.com/p/..."
}
```

## Key Features Explained

### 1. Authentication Integration
- Uses Firebase auth from main app
- Displays user's custom display name if set
- Shows user avatar in bottom navigation
- Falls back to "Гість" (Guest) if not logged in

### 2. Location Detection
- Attempts to get user's actual location via geolocation API
- Falls back to Prague if denied or unavailable
- Updates location display dynamically

### 3. Journey Persistence
- Saves current journey to localStorage:
```javascript
{
    routeId: 1,
    routeName: "Route name",
    currentPoint: 2,
    totalPoints: 5,
    startedAt: "2025-11-02T..."
}
```
- Allows users to resume incomplete journeys
- Shows progress (e.g., "2/5 точок")

### 4. Filter System
- Three filter categories: Nearby, Popular, Custom
- Routes filtered based on category property
- Initial display shows 2 routes per category
- "Show all" button reveals complete list

### 5. Chat Integration
- "Ask ARtie" buttons navigate to index.html with `?openChat=true` parameter
- Main app detects parameter and opens chat automatically
- URL is cleaned up after chat opens

## Customization Guide

### Adding New Routes
Edit the `routes` array in `pathfinder.js`:

```javascript
{
    id: 7,
    title: "🎭 Національний театр",
    emoji: "🎭",
    distance: "2.5km",
    duration: "2h",
    rating: "4.7",
    category: "popular",
    description: "Visit the historic National Theatre",
    vectaryUrl: "YOUR_VECTARY_URL"
}
```

### Updating ARtie's Suggestion
Modify the suggestion text in `pathfinder.html` line 35:
```html
<p class="suggestion-text" id="artie-suggestion-text">
    Your custom suggestion here
</p>
```

Or make it dynamic by updating it in JavaScript based on user's location.

### Customizing Colors
Edit CSS variables in `pathfinder.css`:
```css
:root {
    --vibrant-green: #10B981;
    --vibrant-purple-chat: #A78BFA;
    --vibrant-orange: #F97316;
    /* etc. */
}
```

### Adding Translations
Update `script.js` translations object for each language:
```javascript
pathfinder: {
    title: 'Your Translation',
    greeting: 'Your Translation',
    // etc.
}
```

## User Flow

1. **Entry**: User clicks Pathfinder card on main page
2. **Greeting**: Sees personalized greeting with their name and location
3. **Suggestion**: ARtie suggests a route based on location
4. **Browse**: User can filter by Nearby/Popular/Custom
5. **Select**: Clicks "Почати" (Start) on any route card
6. **Journey Saved**: Progress is automatically saved to localStorage
7. **Navigate**: Redirects to Vectary AR experience
8. **Resume**: Can return later and resume incomplete journey

## Testing

### Test Authentication
1. Sign in via Google on main page
2. Navigate to Pathfinder
3. Verify your name appears in greeting
4. Check avatar appears in bottom nav

### Test Route Selection
1. Click different filter tabs (Nearby/Popular/Custom)
2. Verify routes update correctly
3. Click "Start" button on any route
4. Should redirect to Vectary

### Test Journey Resume
1. Start a route (localStorage will save)
2. Navigate back to Pathfinder
3. "Resume Journey" section should appear
4. Click "Продовжити" to resume

### Test Chat Integration
1. Click "Запитати" in ARtie suggestion widget
2. Should navigate to main page with chat open
3. Click "Відкрити чат" in chat entry section
4. Should also navigate to main page with chat open

## Mobile Optimization
- Fully responsive design
- Touch-friendly buttons and cards
- Smooth scrolling in content area
- Bottom navigation fixed at bottom
- Optimized for screens up to 430px

## Future Enhancements
1. Real geolocation-based route filtering
2. Route creation via ARtie chat
3. Save favorite routes
4. Share routes with friends
5. Route completion badges/achievements
6. Integration with actual navigation/maps
7. Offline route data caching
8. Route reviews and comments

## Troubleshooting

**Routes not showing:**
- Check console for JavaScript errors
- Verify routes array is populated
- Check filter category values

**User name not appearing:**
- Ensure user is signed in
- Check Firebase auth state
- Verify localStorage has displayName saved

**Resume section not showing:**
- Start a route first to create localStorage entry
- Check browser console for localStorage data
- Clear localStorage and try again if issues persist

**Chat not opening from buttons:**
- Verify main app's script.js has URL parameter handler
- Check browser console for navigation errors
- Ensure user is authenticated
