const express = require('express');
const router = express.Router();
const GenAIService = require('../services/genAIService');
const genAIService = new GenAIService();

router.get('/start', async (req, res) => {
  try {
    const startMessage = await genAIService.startRecommendation();
    res.json(startMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to start recommendation' });
  }
});

router.post('/next', async (req, res) => {
  const userResponse = req.body.message;
  try {
    const nextQuestion = await genAIService.getNextQuestion(userResponse);
    res.json(nextQuestion);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get next question' });
  }
});

module.exports = router;
