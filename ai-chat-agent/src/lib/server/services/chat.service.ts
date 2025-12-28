import { db } from '../db';
import { conversations, messages, type Message } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { generateReply } from './llm.service';

export async function processMessage(
  message: string,
  conversationId?: string
): Promise<{
  reply: string;
  conversationId: string;
  messageId: string;
}> {
  let convId = conversationId;

  // Create new conversation if none exists
  if (!convId) {
    const [newConv] = await db
      .insert(conversations)
      .values({})
      .returning();
    convId = newConv.id;
  }

  // Save user message
  await db.insert(messages).values({
    conversationId: convId,
    sender: 'user',
    content: message,
  });

  // Get conversation history (last 10 messages)
  const history = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, convId))
    .orderBy(desc(messages.createdAt))
    .limit(10);

  // Reverse to get chronological order
  const chronologicalHistory = history.reverse();

  // Generate AI reply
  const reply = await generateReply(chronologicalHistory, message);

  // Save AI message
  const [aiMessage] = await db
    .insert(messages)
    .values({
      conversationId: convId,
      sender: 'ai',
      content: reply,
    })
    .returning();

  return {
    reply,
    conversationId: convId,
    messageId: aiMessage.id,
  };
}

export async function getConversationHistory(
  conversationId: string
): Promise<Message[]> {
  const history = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);

  return history;
}
