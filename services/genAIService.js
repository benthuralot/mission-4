const { GoogleGenerativeAI } = require('@google/generative-ai');
require("dotenv").config();

class GenAIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    this.currentQuestionIndex = 0;
    this.userResponses = [];
    this.optedIn = false;
    this.userName = 'User'; // Default name
    this.maxQuestions = 10; // Limit the number of questions
  }

  setUserName(name) {
    this.userName = name;
  }

  async startRecommendation() {
    try {
      const prompt = `
        You are Tina, an AI insurance consultant. Your job is to recommend the best insurance policy for ${this.userName} based on their answers to a series of questions.

        Start by introducing yourself:
        "I’m Tina. I help you choose the right insurance policy. May I ask you a few personal questions to make sure I recommend the best policy for you?"
      `;

      const result = await this.model.generateContent(prompt);
      const firstQuestion = result.response.text();

      return firstQuestion;
    } catch (error) {
      console.error('Error generating recommendation:', error);
      throw error;
    }
  }

  async getNextQuestion(userResponse) {
    if (!this.optedIn) {
      if (userResponse.toLowerCase().includes('yes')) {
        this.optedIn = true;
        return "Great! Let's get started. What do you need coverage for?";
      } else {
        return "Thank you for your time. If you change your mind, feel free to ask for recommendations.";
      }
    }

    this.userResponses.push(userResponse);

    if (this.currentQuestionIndex < this.maxQuestions) {
      const prompt = `
        Based on the following responses from ${this.userName}:
        ${this.userResponses.join('\n')}

        Ask the next relevant question to uncover details to help identify which policy is better.
      `;

      try {
        const result = await this.model.generateContent(prompt);
        const nextQuestion = result.response.text();
        this.currentQuestionIndex++;
        return nextQuestion;
      } catch (error) {
        console.error('Error generating next question:', error);
        throw error;
      }
    } else {
      return await this.getRecommendation();
    }
  }

  async getRecommendation() {
    const prompt = `
      Based on the following responses from ${this.userName}:
      ${this.userResponses.join('\n')}

      Do not explicitly say Based on the following responses from ${this.userName}: in the prompt. Instead, use the responses to generate a recommendation.

      Recommend one or more of the following policies:
      1. **Mechanical Breakdown Insurance (MBI)**: Not available for trucks or racing cars.
      2. **Comprehensive Car Insurance**: Only available for vehicles less than 10 years old.
      3. **Third Party Car Insurance**: Available for all vehicles.

      For each recommendation, explain why it is the best choice. Give this recommendation to the user and do not refer to them by name.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const recommendation = result.response.text();

      return recommendation;
    } catch (error) {
      console.error('Error generating recommendation:', error);
      throw error;
    }
  }
}

module.exports = GenAIService;
