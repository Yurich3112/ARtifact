// Configuration Example for ARtifact Chatbot
// 
// This file shows what you need to configure.
// The actual configuration is in script.js

// ==================================================
// STEP 1: Deploy Cloudflare Worker
// ==================================================
// 1. Copy worker.js to Cloudflare Workers dashboard
// 2. Add your GEMINI_API_KEY as a secret variable
// 3. Deploy and copy your Worker URL

// ==================================================
// STEP 2: Update script.js
// ==================================================
// Open script.js and update line 14 with your Worker URL:

const API_PROXY_URL = 'https://your-worker.your-subdomain.workers.dev/chat';
//                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//                      Replace this with your actual Cloudflare Worker URL

// ==================================================
// STEP 3: GitHub Secrets (Optional - for automation)
// ==================================================
// If using GitHub Actions to deploy the Worker automatically,
// add these secrets to your GitHub repository:
//
// Settings → Secrets and variables → Actions → New repository secret
//
// Required secrets:
// - GEMINI_API_KEY: Your Google Gemini API key
// - CLOUDFLARE_API_TOKEN: From Cloudflare Dashboard
// - CLOUDFLARE_ACCOUNT_ID: From Cloudflare Dashboard

// ==================================================
// Where to Get API Keys
// ==================================================

// Google Gemini API Key (FREE):
// → https://makersuite.google.com/app/apikey

// Cloudflare API Token:
// → https://dash.cloudflare.com/profile/api-tokens
// → Use "Edit Cloudflare Workers" template

// Cloudflare Account ID:
// → https://dash.cloudflare.com
// → Click on Workers & Pages
// → Copy Account ID from the right sidebar

// ==================================================
// Security Notes
// ==================================================
// ✅ API keys should ONLY be in:
//    - Cloudflare Worker secrets (for runtime)
//    - GitHub Secrets (for deployment automation)
//
// ❌ NEVER put API keys in:
//    - Client-side JavaScript (script.js)
//    - Committed files (git)
//    - Public repositories without secrets
