# ARtifact App with AI Chatbot

An augmented reality app with an intelligent chatbot companion powered by Google's Gemini AI.

## Features

- **Ghost of the Past**: Uncover hidden stories and ancient secrets through AR
- **Pathfinder**: Navigate through mysterious locations with interactive AR maps
- **ARtie AI Assistant**: An intelligent chatbot that helps users explore and discover

## Setup Instructions

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key for your project
3. Copy the API key (keep it secure!)

### 2. Set Up GitHub Repository Secrets

1. Go to your GitHub repository
2. Navigate to **Settings > Secrets and variables > Actions**
3. Click **New repository secret**
4. Name: `GEMINI_API_KEY`
5. Value: Your actual Gemini API key
6. Click **Add secret**

### 3. Deploy to GitHub Pages

1. Push your code to a GitHub repository (the placeholder `%GEMINI_API_KEY%` in script.js is safe to commit)
2. Go to Settings > Pages in your repository
3. Under "Source", select **"GitHub Actions"**
4. The GitHub Actions workflow will automatically build and deploy your app with the real API key injected
5. Your app will be available at `https://yourusername.github.io/repository-name`

## API Key Security

This implementation uses a **build-time secret injection** approach for maximum security:

1. **No API keys in source code**: The `script.js` file contains only a placeholder (`%GEMINI_API_KEY%`)
2. **GitHub Secrets**: Your real API key is stored securely in GitHub repository secrets
3. **Automatic build process**: GitHub Actions replaces the placeholder with your real API key during deployment
4. **CORS proxy**: Uses `api.allorigins.win` for secure client-side API calls

**Security Benefits:**
- ✅ API key never appears in version control
- ✅ API key is encrypted in GitHub's secure storage
- ✅ Only accessible during the automated build process
- ✅ No risk of accidental exposure in the repository

**Alternative Security Options:**
- Set up your own CORS proxy server for even more control
- Use different CORS proxy services if needed
- Consider GitHub Enterprise for enhanced security features

## Customization

### Modifying Artie's Personality

The system prompt for ARtie is defined in the `SYSTEM_PROMPT` variable in `script.js`. You can customize:

- Tone and personality
- Response guidelines
- Feature descriptions
- Interaction rules

### API Configuration

You can modify these settings in `script.js`:
- `CORS_PROXY_URL`: Alternative CORS proxy service (default: `api.allorigins.win`)
- `GEMINI_API_URL`: API endpoint (currently using gemini-2.0-flash-lite)
- `GEMINI_API_KEY`: This is automatically injected via GitHub Actions (do not modify manually)

## Troubleshooting

### Common Issues:

1. **API calls not working**: Check that your API key is valid and has sufficient quota
2. **CORS errors**: The proxy service might be down; consider using a different CORS proxy
3. **Rate limiting**: Gemini API has rate limits; the app handles basic errors gracefully

### Alternative CORS Proxies:
- `https://cors-anywhere.herokuapp.com/`
- `https://api.codetabs.com/v1/proxy?quest=`

## Technologies Used

- HTML5, CSS3, JavaScript
- Google Gemini AI API
- Material Symbols (Google Fonts)
- GitHub Pages for hosting

## License

This project is for educational and demonstration purposes.
