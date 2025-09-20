require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const chatRouter = require('./server/routes/chat');

const app = express();
const port = process.env.PORT || 3000;

// Serve static assets from /public
app.disable('x-powered-by');

// Security headers (CSP tuned for this app)
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'"],
        "style-src": ["'self'"],
        "img-src": ["'self'", 'data:'],
        "connect-src": ["'self'"],
        "frame-ancestors": ["'none'"],
      },
    },
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: 'same-origin' },
    referrerPolicy: { policy: 'no-referrer' },
  })
);

// Body parser with size limit
app.use(express.json({ limit: '16kb' }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rate limit the chatbot endpoint to mitigate abuse
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/', chatLimiter, chatRouter);

// Basic 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Centralized error handler (no stack trace leak)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
