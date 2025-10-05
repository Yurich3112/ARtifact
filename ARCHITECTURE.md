# ARtifact AI Chatbot Architecture

## 🏗️ System Overview

```
┌─────────────────┐
│  User's Browser │
└────────┬────────┘
         │
         │ 1. User sends message
         ↓
┌──────────────────────────────┐
│  GitHub Pages (Static Site)  │
│  - index.html                │
│  - script.js                 │  ← Your system prompt lives here
│  - style.css                 │
└────────┬─────────────────────┘
         │
         │ 2. AJAX POST to /chat
         ↓
┌──────────────────────────────┐
│  Cloudflare Worker (Proxy)   │
│  - worker.js                 │
│  - Handles API requests      │  ← API key stored securely here
│  - Adds CORS headers         │
└────────┬─────────────────────┘
         │
         │ 3. Request with API key
         ↓
┌──────────────────────────────┐
│  Google Gemini API           │
│  - gemini-2.0-flash-lite     │
│  - Processes conversation    │
│  - Generates responses       │
└────────┬─────────────────────┘
         │
         │ 4. AI Response
         ↓
       (back to user)
```

## 🔐 Security Architecture

### Why Use a Proxy?

**Problem:** GitHub Pages only serves static files. Any API key in JavaScript would be exposed to users who can view the source code.

**Solution:** Cloudflare Worker acts as a secure proxy:

```
WITHOUT PROXY (❌ INSECURE):
User's Browser → GitHub Pages (API key visible!) → Gemini API

WITH PROXY (✅ SECURE):
User's Browser → GitHub Pages → Cloudflare Worker (API key hidden) → Gemini API
```

### Security Features

1. **API Key Protection**
   - Key stored as encrypted secret in Cloudflare Worker
   - Never exposed to client-side code
   - Not visible in network requests

2. **CORS Protection**
   - Worker validates request origin
   - Prevents unauthorized access
   - Can be restricted to your domain only

3. **Rate Limiting** (can be added)
   - Cloudflare Workers support rate limiting
   - Protects against abuse
   - Prevents excessive API costs

## 📦 Component Details

### Frontend (script.js)

```javascript
// Responsibilities:
- User interface interactions
- Message display with typing effect
- Conversation history management
- System prompt definition
- Calling the Worker API

// Does NOT contain:
- API keys (security)
- Direct AI API calls (goes through proxy)
```

### Proxy (worker.js)

```javascript
// Responsibilities:
- Receives requests from frontend
- Adds API key to requests
- Formats requests for Gemini API
- Handles CORS headers
- Error handling
- Returns responses to frontend

// Security features:
- API key in environment variable
- Request validation
- Error sanitization (no key leaks in errors)
```

### Deployment Workflows

```
.github/workflows/
├── deploy-pages.yml      # Deploys HTML/CSS/JS to GitHub Pages
└── deploy-worker.yml     # Deploys worker.js to Cloudflare
```

## 📊 Data Flow

### User Sends Message

```javascript
// 1. Frontend (script.js)
const response = await fetch(API_PROXY_URL, {
  method: 'POST',
  body: JSON.stringify({
    message: "What is Ghost of the Past?",
    history: [...previousMessages],
    systemPrompt: "You are Artie..."
  })
});

// 2. Worker (worker.js) receives request
// 3. Worker formats for Gemini API
const geminiRequest = {
  contents: [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'I understand' }] },
    ...history,
    { role: 'user', parts: [{ text: message }] }
  ]
};

// 4. Worker calls Gemini with API key
const geminiResponse = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${API_KEY}`
);

// 5. Worker returns response to frontend
return { response: aiText };

// 6. Frontend displays with typing effect
```

## 🔄 Conversation Flow

```
Initial Load:
├── User opens site
├── Clicks "Ask ARtie"
├── Artie sends greeting
└── Ready for conversation

User Message:
├── User types message
├── Message appears in chat
├── POST request to Worker
├── Worker calls Gemini
├── Response streams back
└── Artie types response

Context Retention:
├── All messages stored in conversationHistory[]
├── Sent with each request
├── Gemini maintains context
└── Artie remembers conversation
```

## 🌐 Hosting Architecture

### GitHub Pages
- **Purpose:** Serve static website files
- **Cost:** FREE
- **Limits:** 100GB bandwidth/month, 1GB storage
- **CDN:** Automatic global distribution

### Cloudflare Workers
- **Purpose:** Secure API proxy
- **Cost:** FREE tier (100,000 req/day)
- **Edge Computing:** Runs close to users globally
- **Cold Start:** ~0ms (near instant)

### Google Gemini API
- **Purpose:** AI chat responses
- **Cost:** FREE tier (1,500 req/day)
- **Model:** gemini-2.0-flash-lite
- **Speed:** ~1-2 seconds per response

## 🔧 Configuration Points

### 1. System Prompt (script.js)
```javascript
const SYSTEM_PROMPT = `You are Artie...`;
```
Defines Artie's personality and behavior.

### 2. Worker URL (script.js)
```javascript
const API_PROXY_URL = 'https://your-worker.workers.dev/chat';
```
Points to your Cloudflare Worker.

### 3. API Key (Cloudflare Dashboard)
```
Environment Variable: GEMINI_API_KEY
Type: Secret (encrypted)
```
Stored securely in Worker.

### 4. AI Parameters (worker.js)
```javascript
generationConfig: {
  temperature: 0.9,        // Creativity
  topK: 40,               // Token variety
  topP: 0.95,             // Nucleus sampling
  maxOutputTokens: 1024   // Response length
}
```

## 🚀 Deployment Process

### Manual Deployment
```
1. Deploy Worker to Cloudflare
   ↓
2. Copy Worker URL
   ↓
3. Update script.js with Worker URL
   ↓
4. Push to GitHub
   ↓
5. GitHub Pages auto-deploys
```

### Automated Deployment (with GitHub Actions)
```
1. Set GitHub Secrets (one-time)
   ↓
2. Push code changes to main branch
   ↓
3. GitHub Actions triggers
   ├── deploy-worker.yml runs (updates Worker)
   └── deploy-pages.yml runs (updates site)
   ↓
4. Both deploy automatically
```

## 📈 Scalability

### Current Setup Handles:
- **Users:** Thousands of concurrent users
- **Requests:** 100,000 per day (Worker limit)
- **Messages:** 1,500 per day (Gemini limit)

### To Scale Beyond Free Tier:
1. **Cloudflare Workers Paid:** $5/month for 10M requests
2. **Gemini API Paid:** Pay-as-you-go pricing
3. **Add Caching:** Cache common responses in Worker
4. **Add Rate Limiting:** Prevent abuse

## 🔍 Monitoring

### Check Worker Performance:
```
Cloudflare Dashboard → Workers & Pages → Your Worker
- Request count
- Error rate
- CPU time
- Success rate
```

### Check Gemini Usage:
```
Google AI Studio → API Keys → Your Key
- Daily request count
- Quota remaining
- Error rate
```

### Debug in Browser:
```javascript
// Open DevTools (F12) → Console
// See all requests and responses
// Check for errors in Network tab
```

## 🛠️ Troubleshooting

### Issue: 500 Error from Worker

**Check:**
```bash
# View Worker logs
wrangler tail

# Common causes:
- API key not set
- API key invalid
- Gemini API quota exceeded
```

### Issue: CORS Error

**Fix:** Worker already includes CORS headers. If you still see this:
```javascript
// In worker.js, verify these headers:
'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Methods': 'POST, OPTIONS',
'Access-Control-Allow-Headers': 'Content-Type',
```

### Issue: Slow Responses

**Optimize:**
```javascript
// Reduce maxOutputTokens in worker.js
maxOutputTokens: 512  // Instead of 1024

// Use faster model
gemini-2.0-flash-lite  // Fastest (current)
```

## 🎯 Future Enhancements

Potential improvements:
- [ ] Add rate limiting per user
- [ ] Cache common responses
- [ ] Add conversation persistence (localStorage)
- [ ] Add voice input/output
- [ ] Support image uploads (Gemini Vision)
- [ ] Add analytics (privacy-friendly)
- [ ] A/B test different system prompts

---

## 📚 Additional Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [GitHub Pages Docs](https://docs.github.com/pages)
- [GitHub Actions Docs](https://docs.github.com/actions)
