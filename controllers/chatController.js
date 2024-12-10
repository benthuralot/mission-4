const GeminiAPI = require("../services/genAIService");

exports.chat = async (req, res) => {
  const { userInput, questionCount, userResponses } = req.body;

  try {
    if (!questionCount || questionCount === 1) {
      // Start the recommendation process
      const result = await GeminiAPI.startRecommendation();
      res.json(result);
    } else {
      // Generate the next response or final recommendation
      const result = await GeminiAPI.generateResponse(
        userInput,
        questionCount,
        userResponses
      );
      res.json(result);
    }
  } catch (error) {
    console.error("Error handling chat:", error.message);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};
