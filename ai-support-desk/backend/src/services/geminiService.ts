import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || "";

// Instantiate the SDK client
let genAI: GoogleGenerativeAI | null = null;
if (apiKey && !apiKey.startsWith("YOUR_")) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.error("Failed to initialize GoogleGenerativeAI client:", error);
  }
}

/**
 * Generates an automated customer service reply draft based on conversation context.
 * Supporting dynamic tones to showcase premium SaaS personalization capabilities.
 * 
 * @param history Array of previous messages in the conversation
 * @param customerName Name of the customer for personalized drafts
 * @param tone Tone modifier ("professional", "empathetic", "friendly", "persuasive")
 */
export async function generateDraftReply(
  history: { sender: string; content: string }[],
  customerName: string,
  tone: string = "friendly"
): Promise<string> {
  if (!genAI) {
    return `Hello ${customerName}, thank you for reaching out! A support representative will be with you shortly. (AI Service Offline - Please check your API key)`;
  }

  try {
    // Select the best model for real-time latency
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
    });

    // Construct the context prompt
    const conversationContext = history
      .map((msg) => `${msg.sender === "customer" ? customerName : "Support Agent"}: ${msg.content}`)
      .join("\n");

    const systemPrompt = `
You are an expert AI Customer Support Assistant helping a human support agent answer customer queries.
Your goal is to generate a helpful, clear, and highly appropriate response DRAFT that the human agent can review, edit, and send.

CONTEXT INSTRUCTIONS:
- Customer Name: ${customerName}
- Target Reply Tone: ${tone} (e.g., friendly, professional, empathetic, persuasive)
- Format: Plain text only. Do NOT use markdown bold, lists, or headers. Write a natural conversational paragraph.
- Style: Keep it concise (2-4 sentences max), polite, and directly address the customer's last concerns.
- Action: If the customer asks a complex question, acknowledge the issue and state that the agent is actively investigating. Do not make up fake data or credentials.

Here is the conversation history so far:
${conversationContext}

Please generate the ideal support response draft:
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      generationConfig: {
        maxOutputTokens: 250,
        temperature: 0.7,
      },
    });

    const reply = result.response.text()?.trim() || "";
    // Clean up any stray quotes or markdown formatting
    return reply.replace(/^"|"$/g, "").replace(/\*\*/g, "").trim();
  } catch (error) {
    console.error("Error generating draft from Gemini API:", error);
    return `Hi ${customerName}, thank you for contacting support. I have received your request and am looking into this right away. How else can I assist you in the meantime?`;
  }
}
