const express = require('express');
const router = express.Router();
const { OpenAIAPI } = require('../openai');

router.post('/getChatbotResponse', async (req, res) => {
  const userMessage = (req.body && req.body.userMessage) || '';
  if (typeof userMessage !== 'string' || !userMessage.trim()) {
    return res.status(400).json({ chatbotResponse: 'Please enter a message.' });
  }
  try {
    const chatbotResponse = await OpenAIAPI.generateResponse(userMessage.trim());
    res.json({ chatbotResponse });
  } catch (err) {
    console.error('Error generating response:', err);
    res.status(500).json({ chatbotResponse: 'Sorry, something went wrong.' });
  }
});

module.exports = router;
