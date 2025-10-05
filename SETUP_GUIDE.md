# Quick Setup Guide for ARtifact Chatbot

This guide will get your AI chatbot up and running in about 10 minutes!

## 📋 Checklist

- [ ] Get Google Gemini API Key
- [ ] Create Cloudflare Worker
- [ ] Configure script.js with Worker URL
- [ ] Deploy to GitHub Pages

## 🚀 Step-by-Step Setup

### 1️⃣ Get Your Free Google Gemini API Key (2 minutes)

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy and save your API key somewhere safe

> 💡 Keep this key secret! Never commit it to GitHub.

### 2️⃣ Create Cloudflare Worker (5 minutes)

**Why?** To keep your API key secure and not exposed in browser code.

#### Quick Option (No coding required):

1. Sign up at https://dash.cloudflare.com/sign-up
2. Go to **Workers & Pages** → **Create Application** → **Create Worker**
3. Name: `artifact-chatbot-proxy` (or any name you like)
4. Click **Deploy**
5. Click **Edit Code**
6. Delete all existing code
7. Copy everything from `worker.js` in this repo
8. Paste it into the Cloudflare editor
9. Click **Save and Deploy**

#### Add Your API Key:

1. Click **Settings** tab
2. Click **Variables**
3. Under "Environment Variables", click **Add variable**
4. Variable name: `GEMINI_API_KEY`
5. Type: **Secret** (click "Encrypt")
6. Value: Paste your Gemini API key
7. Click **Save**

#### Copy Your Worker URL:

After deploying, copy your Worker URL from the top.
It looks like: `https://artifact-chatbot-proxy.YOUR-SUBDOMAIN.workers.dev`

### 3️⃣ Configure Your Website (1 minute)

1. Open `script.js` in your code editor
2. Find line 14
3. Replace the URL with your Worker URL:

```javascript
const API_PROXY_URL = 'https://artifact-chatbot-proxy.YOUR-SUBDOMAIN.workers.dev/chat';
```

4. Save the file

### 4️⃣ Deploy to GitHub Pages (2 minutes)

1. Push your code to GitHub
2. Go to your repo **Settings** → **Pages**
3. Under "Source", select: **GitHub Actions**
4. Wait 1-2 minutes for deployment

Done! 🎉 Your chatbot is live!

## 🧪 Testing Your Setup

### Test Locally:

You can test the website locally, but you need the Worker deployed first:

```bash
# Simple Python server
python -m http.server 8000

# Or if you have Python 2
python -m SimpleHTTPServer 8000
```

Visit: http://localhost:8000

### Test the Worker:

You can test your Worker directly using curl:

```bash
curl -X POST https://your-worker.workers.dev/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello!",
    "history": [],
    "systemPrompt": "You are a helpful assistant."
  }'
```

Expected response:
```json
{
  "response": "Hello! How can I help you today?"
}
```

## ⚠️ Common Issues

### Issue: "Oops! I'm having trouble connecting"

**Solutions:**
1. Check that you updated the Worker URL in `script.js`
2. Verify your API key is set correctly in Cloudflare Worker
3. Open browser DevTools (F12) → Console to see error details
4. Make sure your Worker URL ends with `/chat`

### Issue: Worker returns 500 error

**Solutions:**
1. Check that `GEMINI_API_KEY` is set as a **Secret** variable in Worker settings
2. Test your Gemini API key at: https://makersuite.google.com/app/apikey
3. View Worker logs in Cloudflare Dashboard

### Issue: CORS error

**Solution:** The Worker code includes CORS headers. If you still see CORS errors:
1. Make sure you deployed the latest version of `worker.js`
2. Check that your Worker URL is correct
3. Try clearing browser cache

## 📊 Monitoring Usage

### Check Cloudflare Worker Stats:
- Go to Cloudflare Dashboard → Workers & Pages
- Click your worker
- View requests, errors, and CPU time

### Check Gemini API Usage:
- Visit: https://makersuite.google.com/app/apikey
- View your quota and usage

## 💰 Cost Information

Everything is **FREE** for personal use:

| Service | Free Tier |
|---------|-----------|
| Google Gemini 2.0 Flash Lite | 15 req/min, 1,500 req/day |
| Cloudflare Workers | 100,000 requests/day |
| GitHub Pages | Unlimited static hosting |

## 🔒 Security Best Practices

✅ **DO:**
- Keep API keys in Cloudflare Worker secrets
- Use GitHub Secrets for automated deployments
- Use HTTPS for all requests (automatic with GitHub Pages)

❌ **DON'T:**
- Commit API keys to GitHub
- Put API keys in client-side JavaScript
- Share your API keys publicly

## 🎨 Customization

### Change Artie's Personality:
Edit the `SYSTEM_PROMPT` in `script.js` (lines 22-54)

### Use Different AI Model:
In `worker.js`, line 44, replace `gemini-2.0-flash-lite` with:
- `gemini-1.5-pro` (smarter but slower)
- `gemini-1.5-flash` (balanced)

### Adjust Response Style:
In `worker.js`, lines 47-51, modify:
- `temperature`: 0.0 (focused) to 2.0 (creative)
- `maxOutputTokens`: Change response length

## 🆘 Need Help?

1. Check the main [README.md](README.md)
2. Open an issue on GitHub
3. Review [Google Gemini API docs](https://ai.google.dev/docs)

## 🎉 Success!

If Artie responds to your messages, you're all set! Enjoy exploring with your AI tour guide!

---

**Next Steps:**
- Customize Artie's personality
- Add more features
- Share your site with friends
- Star this repo ⭐
