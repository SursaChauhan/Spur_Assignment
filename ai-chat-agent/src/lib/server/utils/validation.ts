export function validateMessage(message: unknown): string {
  if (typeof message !== 'string') {
    throw new Error('Message must be a string');
  }

  const trimmed = message.trim();

  if (trimmed.length === 0) {
    throw new Error('Message cannot be empty');
  }

  if (trimmed.length > 2000) {
    throw new Error('Message too long (max 2000 characters)');
  }

  return trimmed;
}

export function validateUUID(id: unknown): string {
  if (typeof id !== 'string') {
    throw new Error('Invalid ID format');
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(id)) {
    throw new Error('Invalid conversation ID');
  }

  return id;
}
