import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Message } from '../db/schema';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a helpful customer support agent for 'StyleHub' - an online fashion store.
Your name is Alex.

When greeting a customer or answering for the first time in a conversation, briefly introduce yourself by saying your name (for example: "Hi, I'm Alex from StyleHub support.").

STORE INFORMATION:
- Shipping: Free shipping on orders over $50. Standard shipping takes 5-7 business days. Express shipping (2-3 days) available for $15.
- Returns: 30-day return policy. Items must be unworn with tags attached. Refund processed within 5-7 business days.
- Support Hours: Monday-Friday 9AM-6PM EST. Email: support@stylehub.com
- Payment: We accept Visa, Mastercard, Amex, PayPal, and Apple Pay.

RULES:
1. Always be friendly, concise, and helpful
2. If asked about something not in the store info, politely say you don't have that information and offer to connect them with a human agent
3. Keep responses under 100 words when possible
4. Never make up shipping times, prices, or policies`;

export async function generateReply(
  conversationHistory: Message[],
  userMessage: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });

    // Build conversation context (last 10 messages)
    const recentHistory = conversationHistory.slice(-10);
    
    // Format messages for Gemini
    let conversationContext = SYSTEM_PROMPT + '\n\n';
    
    for (const msg of recentHistory) {
      const role = msg.sender === 'user' ? 'Customer' : 'Agent';
      conversationContext += `${role}: ${msg.content}\n`;
    }
    
    conversationContext += `Customer: ${userMessage}\nAgent:`;

    // Generate response
    const result = await model.generateContent(conversationContext);
    const response = result.response;
    const text = response.text();

    if (!text || text.trim().length === 0) {
      throw new Error('Empty response from AI');
    }

    return text.trim();

  } catch (error: any) {
    console.error('LLM Error:', error);

    // Handle specific error cases
    if (error.message?.includes('API key')) {
      return "Service configuration error. Please contact support.";
    }

    if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      return "I'm receiving high traffic. Please try again in a moment.";
    }

    if (error.message?.includes('timeout')) {
      return "Response taking too long. Please try again.";
    }

    // Generic error
    return "I'm having trouble processing your request. Please try again.";
  }
}
