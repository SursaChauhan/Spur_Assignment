<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import Message from './Message.svelte';
  import type { Message as MessageType } from '$lib/server/db/schema';

  export let messages: MessageType[];
  export let isTyping = false;

  let messageContainer: HTMLDivElement;

  function scrollToBottom() {
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }

  onMount(() => {
    scrollToBottom();
  });

  afterUpdate(() => {
    scrollToBottom();
  });
</script>

<div
  bind:this={messageContainer}
  class="flex-1 overflow-y-auto p-4 bg-gray-50"
>
  {#if messages.length === 0}
    <div class="flex items-center justify-center h-full">
      <div class="text-center">
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">
          Welcome to StyleHub Support! 👋
        </h2>
        <p class="text-gray-500">How can I help you today?</p>
        <div class="mt-6 space-y-2">
          <p class="text-sm text-gray-400">Try asking:</p>
          <div class="flex flex-wrap gap-2 justify-center">
            <span class="px-3 py-1 bg-white rounded-full text-sm text-gray-600 border">
              What's your return policy?
            </span>
            <span class="px-3 py-1 bg-white rounded-full text-sm text-gray-600 border">
              Do you offer free shipping?
            </span>
            <span class="px-3 py-1 bg-white rounded-full text-sm text-gray-600 border">
              What payment methods do you accept?
            </span>
          </div>
        </div>
      </div>
    </div>
  {:else}
    {#each messages as message (message.id)}
      <Message
        sender={message.sender}
        content={message.content}
        createdAt={new Date(message.createdAt)}
      />
    {/each}

    {#if isTyping}
      <div class="flex justify-start mb-4">
        <div class="bg-gray-200 rounded-lg px-4 py-2">
          <div class="flex gap-1">
            <span class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
            <span class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
            <span class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
          </div>
        </div>
      </div>
    {/if}
  {/if}
</div>
