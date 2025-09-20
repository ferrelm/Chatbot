require('dotenv').config();
const express = require('express');
const path = require('path');
const chatRouter = require('./server/routes/chat');

const app = express();
const port = process.env.PORT || 3000;

// Serve static assets from /public
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/', chatRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
