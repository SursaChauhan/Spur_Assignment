<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let disabled = false;

  let message = '';
  const dispatch = createEventDispatcher<{ send: string }>();

  function handleSubmit() {
    const trimmed = message.trim();
    if (trimmed && !disabled) {
      dispatch('send', trimmed);
      message = '';
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }

  $: isValid = message.trim().length > 0 && message.length <= 2000;
  $: charCount = message.length;
</script>

<div class="border-t bg-white p-4">
  <div class="flex gap-2">
    <div class="flex-1">
      <textarea
        bind:value={message}
        on:keydown={handleKeydown}
        placeholder="Type your message..."
        rows="1"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        disabled={disabled}
      />
      <div class="flex justify-between mt-1 px-1">
        <span class="text-xs text-gray-500">
          Press Enter to send, Shift+Enter for new line
        </span>
        <span class="text-xs {charCount > 2000 ? 'text-red-500' : 'text-gray-500'}">
          {charCount}/2000
        </span>
      </div>
    </div>
    <button
      on:click={handleSubmit}
      disabled={disabled || !isValid}
      class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors h-fit"
    >
      {disabled ? 'Sending...' : 'Send'}
    </button>
  </div>
</div>
