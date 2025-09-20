# Software Dev Chatbot

Simple Express server that serves a static chat UI from `public/` and routes messages to OpenAI's Chat Completions API.

## Prerequisites

- Node.js 18+ recommended (for built-in `fetch`). If using Node 16, `node-fetch` is included.
- An OpenAI API key in the environment as `OPENAI_API_KEY`.

## Install and Run

1. Install dependencies
2. Set the environment variable
3. Start the server

### macOS / Linux

Option A: Using .env (recommended)
```bash
npm install
cp .env.example .env
# edit .env and set OPENAI_API_KEY
npm start
```

Option B: Export in shell
```bash
npm install
export OPENAI_API_KEY="your_api_key_here"
npm start
```

Then open http://localhost:3000 in your browser.

## Notes

- Server entry is `server.js` at project root.
- Static assets live in `public/`.
- API endpoint is `POST /getChatbotResponse`.
