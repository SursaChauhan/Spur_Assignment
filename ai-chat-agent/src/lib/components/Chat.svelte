<script lang="ts">
  import { onMount } from 'svelte';
  import MessageList from './MessageList.svelte';
  import MessageInput from './MessageInput.svelte';
  import type { Message } from '$lib/server/db/schema';

  let messages: Message[] = [];
  let conversationId: string | null = null;
  let isLoading = false;
  let isTyping = false;

  // Load conversation from localStorage on mount
  onMount(async () => {
    const savedConversationId = localStorage.getItem('conversationId');
    
    if (savedConversationId) {
      conversationId = savedConversationId;
      await loadConversationHistory(savedConversationId);
    }
  });

  async function loadConversationHistory(convId: string) {
    try {
      const response = await fetch(`/api/chat?conversationId=${convId}`);
      
      if (response.ok) {
        const data = await response.json();
        messages = data.messages;
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error);
    }
  }

  async function handleSend(event: CustomEvent<string>) {
    const userMessage = event.detail;

    // Add user message to UI immediately
    const tempUserMessage: Message = {
      id: crypto.randomUUID(),
      conversationId: conversationId || '',
      sender: 'user',
      content: userMessage,
      createdAt: new Date(),
    };
    messages = [...messages, tempUserMessage];

    isLoading = true;
    isTyping = true;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Save conversationId
      if (!conversationId) {
        conversationId = data.conversationId;
        localStorage.setItem('conversationId', conversationId);
      }

      // Add AI response to messages
      const aiMessage: Message = {
        id: data.messageId,
        conversationId: data.conversationId,
        sender: 'ai',
        content: data.reply,
        createdAt: new Date(),
      };
      messages = [...messages, aiMessage];

    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Show error message in chat
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        conversationId: conversationId || '',
        sender: 'system',
        content: error.message || 'Failed to send message. Please try again.',
        createdAt: new Date(),
      };
      messages = [...messages, errorMessage];
    } finally {
      isLoading = false;
      isTyping = false;
    }
  }

  function handleNewChat() {
    messages = [];
    conversationId = null;
    localStorage.removeItem('conversationId');
  }
</script>

<div class="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-lg">
  <!-- Header -->
  <div class="bg-blue-500 text-white p-4 flex justify-between items-center">
    <div>
      <h1 class="text-xl font-bold">StyleHub Support</h1>
      <p class="text-sm text-blue-100">We're here to help!</p>
    </div>
    <button
      on:click={handleNewChat}
      class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
    >
      New Chat
    </button>
  </div>

  <!-- Messages -->
  <MessageList {messages} {isTyping} />

  <!-- Input -->
  <MessageInput disabled={isLoading} on:send={handleSend} />
</div>
