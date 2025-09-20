// Optional: load key from a local, non-committed config.js at project root
let FILE_API_KEY;
try {
  FILE_API_KEY = require('../config').OPENAI_API_KEY;
} catch (_) {}

// Prefer global fetch (Node 18+); fallback to dynamic import of node-fetch for CJS compatibility
const fetchImpl = (typeof fetch === 'function')
  ? fetch
  : (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

class OpenAIAPI {
  static async generateResponse(userMessage = '', conversationHistory = []) {
    const apiKey = process.env.OPENAI_API_KEY || FILE_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY is not set');
      return 'OpenAI API key is not configured on the server.';
    }

    const endpoint = 'https://api.openai.com/v1/chat/completions';
    try {
      const response = await fetchImpl(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo-0125',
          messages: conversationHistory.concat([{ role: 'user', content: userMessage }]),
          max_tokens: 150,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('OpenAI API error:', response.status, text);
        return 'Sorry, I had trouble contacting the AI service.';
      }

      const responseData = await response.json();
      const msg = responseData?.choices?.[0]?.message?.content;
      if (msg) return msg;
      console.error('Unexpected OpenAI response shape:', responseData);
      return 'Sorry, I could not understand that.';
    } catch (err) {
      console.error('Error calling OpenAI API:', err);
      return 'Sorry, something went wrong while contacting the AI service.';
    }
  }
}

module.exports = { OpenAIAPI };
