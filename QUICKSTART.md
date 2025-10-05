# 🚀 Quick Start Checklist

Get your AI chatbot running in **10 minutes**!

## ☑️ Prerequisites

- [ ] GitHub account
- [ ] Cloudflare account (free signup)
- [ ] Google account (for Gemini API)

---

## 📝 Setup Steps

### Step 1: Get API Key (2 min)
- [ ] Go to https://makersuite.google.com/app/apikey
- [ ] Click "Create API Key"
- [ ] Copy and save the key (keep it secret!)

### Step 2: Deploy Worker (5 min)
- [ ] Sign up at https://dash.cloudflare.com
- [ ] Go to **Workers & Pages** → **Create Application** → **Create Worker**
- [ ] Name it: `artifact-chatbot-proxy`
- [ ] Click **Deploy** → **Edit Code**
- [ ] Copy all code from `worker.js` (this repo)
- [ ] Paste and click **Save and Deploy**
- [ ] Go to **Settings** → **Variables** → **Add variable**
  - Name: `GEMINI_API_KEY`
  - Type: **Secret**
  - Value: [Your API key from Step 1]
  - Click **Encrypt** and **Save**
- [ ] Copy your Worker URL (looks like: `https://artifact-chatbot-proxy.xxx.workers.dev`)

### Step 3: Configure Site (1 min)
- [ ] Open `script.js` in your code editor
- [ ] Line 14: Replace with your Worker URL from Step 2
  ```javascript
  const API_PROXY_URL = 'https://YOUR-WORKER-URL.workers.dev/chat';
  ```
- [ ] Save the file

### Step 4: Deploy to GitHub Pages (2 min)
- [ ] Commit and push your code to GitHub
- [ ] Go to **Settings** → **Pages**
- [ ] Source: Select **GitHub Actions**
- [ ] Wait ~2 minutes for deployment
- [ ] Visit your site!

---

## ✅ Testing

### Test Chat:
1. Open your GitHub Pages site
2. Click "Ask ARtie" button
3. Type: "What is Ghost of the Past?"
4. Artie should respond in character!

### Expected Behavior:
- ✅ Artie greets you when chat opens
- ✅ Messages appear with typing effect
- ✅ Artie responds to your questions
- ✅ Artie stays in character as a tour guide

---

## 🚨 Troubleshooting

### "Oops! I'm having trouble connecting"

**Solution:**
1. Check Worker URL in `script.js` line 14
2. Verify URL ends with `/chat`
3. Open browser DevTools (F12) → Console
4. Look for error messages

### Worker returns error

**Solution:**
1. Check `GEMINI_API_KEY` is set in Worker settings
2. Verify it's type: **Secret** (encrypted)
3. Test your API key at https://makersuite.google.com

### Chat doesn't open

**Solution:**
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check browser console for JavaScript errors

---

## 📚 Next Steps

After setup works:

- [ ] Read [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed info
- [ ] Customize Artie's personality in `script.js`
- [ ] Set up GitHub Actions for auto-deployment (optional)
- [ ] Add custom domain (optional)

---

## 💡 Quick Tips

**Free Tier Limits:**
- Gemini: 1,500 requests/day
- Cloudflare: 100,000 requests/day
- GitHub Pages: Unlimited

**Customization:**
- Change Artie's personality: Edit `SYSTEM_PROMPT` in `script.js`
- Adjust AI creativity: Modify `temperature` in `worker.js`
- Change AI model: Update model name in `worker.js` line 44

**Security:**
- ✅ API key is safe in Cloudflare Worker
- ✅ Never exposed to users
- ✅ Not in browser code

---

## 🎉 Done!

If Artie is responding to your messages, you're all set!

**Questions?**
- Check [README.md](README.md) for full documentation
- Read [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- Open an issue on GitHub

---

**Happy exploring with Artie! ✨**
