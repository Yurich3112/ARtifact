# Authentication Setup Guide

## 🔐 Overview

Your ARtifact app now requires users to sign in with Google before they can chat with ARtie. This protects your AI chatbot from unauthorized access and abuse.

## Architecture

```
User clicks "Ask ARtie"
    ↓
Check if signed in
    ↓ (No) → Show login screen
    ↓ (Yes) → Open chat
         ↓
User sends message → Frontend includes Firebase ID token
         ↓
Cloudflare Worker verifies token
         ↓ (Invalid) → Return 401 Unauthorized
         ↓ (Valid) → Call Gemini API
         ↓
Return AI response
```

## 🚀 Setup Steps

### Step 1: Create Firebase Project (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `artifact-app` (or your choice)
4. Disable Google Analytics (optional, not needed)
5. Click **"Create project"**

### Step 2: Enable Google Authentication

1. In Firebase Console, go to **Authentication** → **Get started**
2. Click **"Sign-in method"** tab
3. Click **"Google"** → **Enable**
4. Enter support email (your email)
5. Click **"Save"**

### Step 3: Register Your Web App

1. In Firebase Console, click the gear icon ⚙️ → **Project settings**
2. Scroll down to **"Your apps"**
3. Click the **Web icon** `</>`
4. App nickname: `artifact-web`
5. Check **"Also set up Firebase Hosting"** (optional)
6. Click **"Register app"**

### Step 4: Get Firebase Configuration

You'll see a configuration object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "artifact-app.firebaseapp.com",
  projectId: "artifact-app",
  storageBucket: "artifact-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### Step 5: Update Your Code

#### A. Update `script.js`

Replace the placeholder config (lines 6-13) with your actual Firebase config:

```javascript
// Firebase config - REPLACE WITH YOUR OWN
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

> ⚠️ **Note:** The Firebase `apiKey` here is safe to expose publicly. It only identifies your Firebase project and is meant to be in client-side code.

#### B. Update Cloudflare Worker

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → **artifact-chatbot-proxy**
3. Go to **Settings** → **Variables**
4. Add a new variable:
   - Name: `FIREBASE_PROJECT_ID`
   - Type: **Text** (not secret)
   - Value: Your project ID (e.g., `artifact-app`)
5. Click **"Save"**

### Step 6: Update Authorized Domains

1. Back in Firebase Console → **Authentication** → **Settings**
2. Scroll to **"Authorized domains"**
3. Add your GitHub Pages domain:
   - `your-username.github.io`
   - Or your custom domain if you have one
4. `localhost` is already authorized for local testing

### Step 7: Deploy Your Code

```bash
# Commit changes
git add .
git commit -m "Add Google Sign-In authentication"
git push origin main

# Redeploy Cloudflare Worker
wrangler deploy
```

## 🧪 Testing

### Test Locally

```bash
# Serve locally
python -m http.server 8000
# Visit: http://localhost:8000
```

1. Open the app
2. You should see the login overlay
3. Click **"Sign in with Google"**
4. Sign in with your Google account
5. After sign-in, the overlay disappears
6. Click **"Ask ARtie"** - chat should work!
7. Click logout button (top-right) to sign out

### Test Authentication Protection

1. Open browser DevTools (F12)
2. Go to Application tab → Storage → Clear site data
3. Refresh page
4. Try to click "Ask ARtie" - should show "Please sign in" message
5. Try to send API request without token - should return 401 Unauthorized

## 🔒 Security Features

### What's Protected

✅ **API Calls**: Only authenticated users can send messages to ARtie  
✅ **Token Validation**: Worker verifies Firebase ID tokens  
✅ **Automatic Expiry**: Tokens expire after 1 hour (Firebase handles refresh)  
✅ **No Key Exposure**: API keys remain secure in Cloudflare Worker

### What's NOT Protected

⚠️ The main app (Ghost of the Past, Pathfinder links) is still accessible  
⚠️ Only the chatbot requires authentication

If you want to protect the entire app, you can add authentication checks to all features.

## 📊 Monitoring

### Check Who's Logged In

1. Firebase Console → **Authentication** → **Users**
2. See list of all users who have signed in
3. View: email, UID, last sign-in date
4. Can manually disable/delete users

### Check Usage

1. Firebase Console → **Authentication** → **Usage**
2. See daily/monthly active users
3. Monitor authentication events

### Free Tier Limits

- **Firebase Auth**: 50,000 active users/month FREE
- **Gemini API**: 1,500 requests/day FREE
- **Cloudflare Workers**: 100,000 requests/day FREE

## 🛠️ Troubleshooting

### "Failed to sign in" Error

**Cause:** Domain not authorized in Firebase

**Fix:**
1. Firebase Console → Authentication → Settings
2. Add your domain to Authorized domains

### "Unauthorized" when chatting

**Cause:** Token not being sent or invalid

**Fix:**
1. Check browser console for errors
2. Verify `FIREBASE_PROJECT_ID` in Worker settings
3. Try signing out and back in

### Login popup blocked

**Cause:** Browser blocking pop-ups

**Fix:**
1. Allow pop-ups for your domain
2. Or use redirect method (requires code change)

### Token expired error

**Cause:** Token expired after 1 hour

**Fix:** Sign out and sign in again  
(Auto-refresh can be implemented if needed)

## 🎨 Customization

### Change Sign-In Button Text

In `index.html` line 25:

```html
<button id="google-signin-btn" class="google-signin-btn">
    ...
    Sign in with Google  <!-- Change this text -->
</button>
```

### Change Welcome Message

In `index.html` lines 16-17:

```html
<h2>Welcome to ARtifact</h2>
<p>Sign in to chat with ARtie, your AI tour guide</p>
```

### Add More Sign-In Methods

Firebase supports:
- Email/Password
- Facebook
- Twitter
- GitHub
- Anonymous

Enable them in Firebase Console → Authentication → Sign-in method

Then update `script.js` to add more providers.

## 📱 Multi-Device Support

Users can sign in from multiple devices:
- Desktop browser
- Mobile browser
- Different computers

Their authentication syncs automatically through Firebase!

## 🔄 Sign Out Flow

When users click the logout button:
1. Firebase signs them out
2. Conversation history is cleared
3. Login screen reappears
4. Chat becomes inaccessible

## 📝 Best Practices

### Do ✅

- Keep Firebase config in environment variables for production
- Monitor authentication logs regularly
- Set up email verification if needed
- Add terms of service acceptance
- Implement rate limiting per user

### Don't ❌

- Don't commit Firebase config to public repos (though apiKey is safe)
- Don't disable security rules
- Don't allow anonymous authentication without consideration
- Don't skip token verification on backend

## 🆘 Support

Having issues? Check:

1. [Firebase Auth Docs](https://firebase.google.com/docs/auth)
2. [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
3. Browser console for error messages
4. Firebase Console logs

---

**Congratulations! Your chatbot is now protected with Google Sign-In! 🎉**
