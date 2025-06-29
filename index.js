import { CohereClient } from "cohere-ai";
import dotenv from "dotenv";
import readline from "readline";

// Load environment variables
dotenv.config();

// Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Define colors using ANSI escape codes
const colors = {
  user: "\x1b[36m", // Cyan for user
  bot: "\x1b[33m",  // Yellow for bot
  reset: "\x1b[0m", // Reset to default color
};

// Function to interact with Cohere
async function chatWithCohere() {
  console.log("Welcome to the Cohere chatbot! Type 'exit' to quit.");

  // Start the chat loop
  while (true) {
    const userInput = await askQuestion(`${colors.user}You: `);

    // Exit the chat if the user types 'exit'
    if (userInput.toLowerCase() === "exit") {
      console.log("Goodbye!");
      rl.close();
      break;
    }

    // Send the user's message to Cohere
    try {
      const response = await cohere.generate({
        prompt: userInput,
        maxTokens: 100,
      });

      // Display Cohere's response in bot's color
      console.log(`${colors.bot}Cohere: ${response.generations[0].text}${colors.reset}`);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
}

// Helper function to ask questions using readline
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      console.log(colors.reset); // Reset color after user input
      resolve(answer);
    });
  });
}

// Start the chatbot
chatWithCohere();