// Cloudflare Worker for ARtifact AI Chatbot
// This proxy keeps your API key secure by handling requests server-side

// Simple token verification (validates Firebase ID token format)
async function verifyFirebaseToken(token, projectId) {
  if (!token) return false;
  
  try {
    // Decode JWT header and payload (basic validation)
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    
    // Basic checks
    if (!payload.aud || !payload.exp || !payload.iat) return false;
    if (payload.aud !== projectId) return false;
    if (Date.now() / 1000 > payload.exp) return false; // Token expired
    
    // For production, use Google's public keys to verify signature
    // This is a simplified version that checks basic token structure
    return true;
  } catch (e) {
    return false;
  }
}

export default {
  async fetch(request, env) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Only allow POST requests to /chat endpoint
    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/chat') {
      return new Response('Not Found', { status: 404 });
    }

    // Check authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized', message: 'Authentication required' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const token = authHeader.substring(7);
    const isValid = await verifyFirebaseToken(token, env.FIREBASE_PROJECT_ID || 'your-project-id');
    
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Unauthorized', message: 'Invalid authentication token' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    try {
      // Parse incoming request
      const { message, history, systemPrompt } = await request.json();

      // Build conversation history for Gemini API
      const contents = [];
      
      // Add system prompt as first user message with model response
      contents.push({
        role: 'user',
        parts: [{ text: `System Instructions: ${systemPrompt}\n\nPlease acknowledge that you understand these instructions and will follow them.` }]
      });
      contents.push({
        role: 'model',
        parts: [{ text: 'I understand and will follow these instructions as Artie, the ARtifact AI companion.' }]
      });

      // Add conversation history (excluding the current message)
      if (history && history.length > 0) {
        history.slice(0, -1).forEach(msg => {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          });
        });
      }

      // Add current user message
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      // Call Gemini API
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: contents,
            generationConfig: {
              temperature: 0.9,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 256,
            },
            safetySettings: [
              {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              }
            ]
          }),
        }
      );

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('Gemini API error:', errorText);
        throw new Error(`Gemini API error: ${geminiResponse.status}`);
      }

      const geminiData = await geminiResponse.json();
      
      // Extract response text
      const aiResponse = geminiData.candidates[0]?.content?.parts[0]?.text || 
                        "I'm having trouble responding right now. Please try again!";

      // Return response with CORS headers
      return new Response(JSON.stringify({ response: aiResponse }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Internal server error',
          message: error.message 
        }), 
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};
