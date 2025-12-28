import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { processMessage, getConversationHistory } from '$lib/server/services/chat.service';
import { validateMessage, validateUUID } from '$lib/server/utils/validation';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { message, conversationId } = body;

    // Validate message
    let validatedMessage: string;
    try {
      validatedMessage = validateMessage(message);
    } catch (error: any) {
      return json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Validate conversationId if provided
    let validatedConversationId: string | undefined;
    if (conversationId) {
      try {
        validatedConversationId = validateUUID(conversationId);
      } catch (error: any) {
        return json(
          { error: error.message },
          { status: 400 }
        );
      }
    }

    // Process the message
    const result = await processMessage(validatedMessage, validatedConversationId);

    return json({
      reply: result.reply,
      conversationId: result.conversationId,
      messageId: result.messageId,
    });

  } catch (error: any) {
    console.error('API Error:', error);
    
    return json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
};

export const GET: RequestHandler = async ({ url }) => {
  try {
    const conversationId = url.searchParams.get('conversationId');

    if (!conversationId) {
      return json(
        { error: 'conversationId is required' },
        { status: 400 }
      );
    }

    // Validate conversationId
    let validatedConversationId: string;
    try {
      validatedConversationId = validateUUID(conversationId);
    } catch (error: any) {
      return json(
        { error: error.message },
        { status: 400 }
      );
    }

    const history = await getConversationHistory(validatedConversationId);

    return json({ messages: history });

  } catch (error: any) {
    console.error('API Error:', error);
    
    return json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
};
