import express from "express";
import { CohereClient } from "cohere-ai";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Enable JSON parsing
app.use(cors()); // Enable Cross-Origin requests

// Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY, // API Key from environment variable
});

// API Endpoint for chatbot interaction
app.post("/chat", async (req, res) => {
  const { message } = req.body; // Get user message from request

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const response = await cohere.generate({
      prompt: message,
      maxTokens: 0, // Removing the limit for response length
    });

    // Send the chatbot's response back to the frontend
    res.json({ reply: response.generations[0].text.trim() });
  } catch (error) {
    console.error("Cohere API Error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
