const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

class GeminiAPI {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
  }

  async startRecommendation() {
    try {
      const prompt = `
        You are Tina, an AI insurance consultant. Your job is to recommend the best insurance policy for a user based on their answers to a series of questions.

        Then proceed with questions, one at a time, to gather details such as:
        - Do they need coverage for their car, third party only, or both?
        - What type of vehicle do they own (e.g., car, truck, racing car)?
        - How old is the vehicle?
        
        Based on their responses, recommend one of the following policies:
        1. **Mechanical Breakdown Insurance (MBI)**: Not available for trucks or racing cars.
        2. **Comprehensive Car Insurance**: Only available for vehicles less than 10 years old.
        3. **Third Party Car Insurance**: Available for all vehicles.

        For each recommendation, explain why it is the best choice.
        
        Start by asking the user: "I’m Tina. May I ask you a few personal questions to help recommend the best insurance policy for you?"
      `;

      const result = await this.model.generateContent(prompt);
      const firstQuestion = result.response.text();

      return {
        response: firstQuestion,
        questionCount: 1,
        userResponses: [],
      };
    } catch (error) {
      console.error("Error starting recommendation:", error);
      throw error;
    }
  }

  async generateResponse(userInput, questionCount, userResponses) {
    try {
      if (!userInput || typeof userInput !== "string") {
        throw new Error("Invalid user input: Must be a non-empty string");
      }
  
      const nextQuestionCount = questionCount + 1;
  
      // Add the user's response to the history
      userResponses.push({
        questionNumber: questionCount,
        response: userInput,
      });
  
      let systemPrompt;
  
      // If Tina is still asking questions (not at recommendation yet)
      if (nextQuestionCount <= 3) {
        systemPrompt = `
          You are Tina, an AI insurance consultant. Continue the conversation to gather details to recommend the best insurance policy. 
          Here is the user's conversation history:
          ${userResponses
            .map(
              (entry) =>
                `Question ${entry.questionNumber}: ${entry.response}`
            )
            .join("\n")}
  
          Based on the above, ask the next relevant question.
        `;
      } else {
        // Final recommendation logic
        systemPrompt = `
          You are Tina, an AI insurance consultant. Based on the user's answers:
          ${userResponses
            .map(
              (entry) =>
                `Question ${entry.questionNumber}: ${entry.response}`
            )
            .join("\n")}
  
          Recommend the best insurance policy. Provide a clear explanation of why it fits the user's needs.
        `;
      }
  
      // Generate a response
      const result = await this.model.generateContent(systemPrompt);
      const nextResponse = result.response.text();
  
      return {
        response: nextResponse,
        questionCount: nextQuestionCount,
        userResponses,
        isComplete: nextQuestionCount > 3, // Ends after 3 questions
      };
    } catch (error) {
      console.error("Error generating response:", error.message);
      throw error;
    }
  }
}  

module.exports = new GeminiAPI();
