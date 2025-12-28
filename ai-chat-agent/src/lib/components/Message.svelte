<script lang="ts">
  export let sender: 'user' | 'ai' | 'system';
  export let content: string;
  export let createdAt: Date;

  function formatTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  }
</script>

<div class="flex {sender === 'user' ? 'justify-end' : 'justify-start'} mb-4">
  <div class="max-w-[70%]">
    <div
      class="rounded-lg px-4 py-2 {sender === 'user'
        ? 'bg-blue-500 text-white'
        : sender === 'ai'
          ? 'bg-gray-200 text-gray-900'
          : 'bg-yellow-100 text-yellow-900 border border-yellow-300'}"
    >
      <p class="text-sm whitespace-pre-wrap break-words">{content}</p>
    </div>
    <p class="text-xs text-gray-500 mt-1 {sender === 'user' ? 'text-right' : 'text-left'}">
      {formatTime(createdAt)}
    </p>
  </div>
</div>
