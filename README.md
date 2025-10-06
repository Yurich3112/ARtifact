# ARtifact 🏛️✨

[![Kreativ OutHack](https://img.shields.io/badge/Kreativ-OutHack%20International-blue)](https://kreativeu.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Authentication-orange)](https://firebase.google.com)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-f38020)](https://workers.cloudflare.com)

**ARtifact** is an intelligent AR tour guide application that brings history and culture to life through Augmented Reality and AI-powered conversations. Developed by **Harmon AI** for the **Kreativ OutHack International** hackathon.

![ARtifact Banner](bg.png)

## 🌟 Overview

ARtifact transforms the way people explore cultural heritage by combining AR visualization with an AI companion named **ARtie**. Whether you're discovering lost landmarks or navigating through historic routes, ARtifact makes exploration interactive, educational, and exciting.

## ✨ Features

### 🤖 ARtie - Your AI Tour Guide
- **Intelligent Conversations**: Chat with ARtie, an AI companion powered by Google's Gemini API
- **Multilingual Support**: Interface and AI responses available in 8 languages:
  - English 🇬🇧
  - Українська 🇺🇦
  - Español 🇪🇸
  - Français 🇫🇷
  - Deutsch 🇩🇪
  - Italiano 🇮🇹
  - Čeština 🇨🇿
  - Polski 🇵🇱
- **Personalized Experience**: Customizable display name with conversation memory
- **Context-Aware**: ARtie understands your preferences and responds in your chosen language

### 🔮 AR Experiences

#### Ghost of the Past
Uncover hidden stories and ancient secrets by visualizing lost landmarks in Augmented Reality. See what once stood in historical locations and learn their stories.

#### Pathfinder
Navigate through mysterious and historic locations with AR-guided paths. Discover the most scenic and culturally significant routes.

### 🔐 Secure Authentication
- Google Sign-In integration via Firebase Authentication
- Protected chat access for registered users only
- Persistent user preferences and settings

### 🎨 Modern UI/UX
- Mobile-first responsive design
- Smooth animations and transitions
- Beautiful gradient themes and glassmorphism effects
- Intuitive bottom navigation
- Expandable chat interface

## 🛠️ Tech Stack

### Frontend
- **HTML5/CSS3**: Modern, responsive interface
- **JavaScript (ES6+)**: Vanilla JS with modular architecture
- **Firebase SDK**: Authentication and user management
- **Material Symbols**: Google's icon system
- **Inter Font**: Clean, modern typography

### Backend
- **Cloudflare Workers**: Serverless API proxy
- **Google Gemini API**: AI-powered conversations
- **Firebase Auth**: Secure user authentication and token validation

### Storage
- **LocalStorage**: User preferences and settings persistence
- **Firebase**: User authentication state

## 📁 Project Structure

```
artifact-app/
├── index.html              # Main HTML structure
├── script.js               # Application logic & AI integration
├── style.css               # Styling and animations
├── worker.js               # Cloudflare Worker for API proxy
├── wrangler.toml          # Cloudflare Workers configuration
├── logo.png               # Application logo
├── bg.png                 # Background image
├── config.example.js      # Configuration template
├── ARCHITECTURE.md        # Architecture documentation
├── AUTH_SETUP.md          # Authentication setup guide
├── SETUP_GUIDE.md         # General setup instructions
└── QUICKSTART.md          # Quick start guide
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Firebase account
- Cloudflare account
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/artifact-app.git
   cd artifact-app
   ```

2. **Configure Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Google Authentication
   - Copy your Firebase configuration to `script.js`

3. **Set up Cloudflare Worker**
   ```bash
   npm install -g wrangler
   wrangler login
   ```

4. **Configure API Keys**
   ```bash
   wrangler secret put GEMINI_API_KEY
   # Enter your Google Gemini API key when prompted
   ```

5. **Deploy Worker**
   ```bash
   wrangler deploy
   ```

6. **Update API URL**
   - Update `API_PROXY_URL` in `script.js` with your deployed Worker URL

7. **Run Locally**
   - Simply open `index.html` in a modern web browser
   - Or use a local server:
   ```bash
   npx serve
   ```

## 🎯 Usage

1. **Sign In**: Click "Sign in with Google" to authenticate
2. **Choose Language**: Access Profile settings to select your preferred language
3. **Set Display Name**: Customize how ARtie addresses you
4. **Explore**: Browse Ghost of the Past and Pathfinder AR experiences
5. **Chat with ARtie**: Click "Ask ARtie" to start a conversation with your AI guide

## 🌍 Multilingual System

ARtifact features a comprehensive internationalization system:
- **UI Translation**: All interface elements translate based on selected language
- **AI Responses**: ARtie responds in the user's chosen language
- **Name Preservation**: User names remain in original script (no translation)
- **Browser Detection**: Automatic language selection based on browser settings for non-authenticated users

## 🔒 Security Features

- **Firebase Authentication**: Secure Google Sign-In
- **Token Validation**: Backend verification of user tokens
- **API Key Protection**: Sensitive keys stored in Cloudflare Workers secrets
- **CORS Protection**: Proper request origin validation
- **Client-Side Security**: User preferences stored locally per-user

## 🎨 Design Philosophy

- **Mobile-First**: Optimized for smartphones and tablets
- **Minimal & Modern**: Clean interface with smooth animations
- **Accessible**: High contrast, readable typography
- **Performance**: Lightweight, fast-loading assets
- **User-Centric**: Intuitive navigation and clear feedback

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 👥 Team - Harmon AI

ARtifact was developed by the **Harmon AI** team for the **Kreativ OutHack International** hackathon, showcasing the intersection of AI, AR, and cultural preservation.

## 🏆 Hackathon

**Kreativ OutHack International** - A global hackathon focused on innovative solutions for creative industries and cultural heritage.

## 📄 License

This project was created for the Kreativ OutHack International hackathon.

## 🙏 Acknowledgments

- **Google Gemini API** for powering ARtie's intelligence
- **Firebase** for authentication infrastructure
- **Cloudflare** for serverless computing
- **Vectary** for AR experience hosting
- **Kreativ OutHack** for the opportunity to innovate

## 📞 Contact & Support

For questions, feedback, or collaboration opportunities, please reach out to the Harmon AI team.

---

**Made with ❤️ by Harmon AI for Kreativ OutHack International**

*Bringing history to life, one artifact at a time.* 🏛️✨

