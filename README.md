# StyleHub AI Support Chat

A full-stack AI-powered customer support chat application built for Spur's founding engineer take-home assignment.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Supabase account)
- Gemini API key

### Installation

1. **Clone the repository**
```bash
   git clone <your-repo-url>
   cd ai-chat-agent
```

2. **Install dependencies**
```bash
   npm install
```

3. **Setup environment variables**
```bash
   cp .env.example .env
```
   
   Edit `.env` and add your credentials:
```bash
   DATABASE_URL=your_postgresql_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=development
```

4. **Push database schema**
```bash
   npm run db:push
```

5. **Start development server**
```bash
   npm run dev
```

6. **Open browser**
```
   http://localhost:5173
```

---

## 🏗️ Architecture

### Tech Stack
- **Framework**: SvelteKit (TypeScript)
- **Database**: PostgreSQL + Drizzle ORM
- **LLM**: Google Gemini 2.5 Flash
- **Styling**: Tailwind CSS v4
- **Deployment**: Vercel (frontend + API) + Supabase (database)

### Project Structure
```
ai-chat-agent/
├── src/
│   ├── lib/
│   │   ├── server/              # Backend code (server-only)
│   │   │   ├── db/
│   │   │   │   ├── schema.ts    # Drizzle database schema
│   │   │   │   └── index.ts     # Database connection
│   │   │   ├── services/
│   │   │   │   ├── llm.service.ts      # Gemini API integration
│   │   │   │   └── chat.service.ts     # Business logic
│   │   │   └── utils/
│   │   │       └── validation.ts       # Input validation
│   │   └── components/          # Svelte UI components
│   │       ├── Chat.svelte
│   │       ├── MessageList.svelte
│   │       ├── MessageInput.svelte
│   │       └── Message.svelte
│   ├── routes/
│   │   ├── +page.svelte         # Main chat page
│   │   ├── +layout.svelte       # Root layout
│   │   └── api/
│   │       └── chat/
│   │           └── +server.ts   # API endpoint
│   └── app.css                  # Tailwind CSS
├── drizzle/                     # Database migrations
├── .env                         # Environment variables (not committed)
├── .env.example                 # Environment template
├── drizzle.config.ts            # Drizzle configuration
├── package.json
└── README.md
```

### Database Schema

**conversations**
- `id`: UUID (primary key)
- `createdAt`: timestamp

**messages**
- `id`: UUID (primary key)
- `conversationId`: UUID (foreign key → conversations.id)
- `sender`: enum ('user' | 'ai')
- `content`: text
- `createdAt`: timestamp

**Indexes:**
- `messages.conversationId` - for fetching conversation history
- `messages.createdAt` - for chronological ordering

---

## 🤖 LLM Integration

### Provider
**Google Gemini 2.5 Flash** (`gemini-2.5-flash`)

### Why Gemini?
- Fast response times (~1-2 seconds)
- Generous free tier
- Good instruction-following for support tasks
- Cost-effective for prototyping

### Prompt Strategy

**System Prompt:**
- Defines role as StyleHub support agent
- Includes hardcoded FAQ knowledge (shipping, returns, support hours, payments)
- Sets behavioral rules (concise, helpful, don't make up info)

**Context Window:**
- Last 10 messages included for context
- Keeps conversation coherent
- Balances cost vs. memory

**Configuration:**
```typescript
{
  model: 'gemini-2.5-flash',
  temperature: 0.7,        // Balanced creativity
  maxOutputTokens: 500     // Cost control
}
```

### Error Handling
- **Invalid API key** → "Service configuration error"
- **Rate limit hit** → "High traffic, try again in a moment"
- **Timeout (>30s)** → "Response taking too long"
- **Network errors** → "Trouble processing request"
- All errors logged server-side for debugging

---

## 📋 Key Features

### ✅ Implemented
- [x] Real-time AI chat interface
- [x] Conversation persistence (localStorage + database)
- [x] Message history loads on page refresh
- [x] FAQ knowledge (shipping, returns, support hours, payments)
- [x] Input validation (empty, length limits)
- [x] Error handling (LLM failures, network issues)
- [x] Loading states & typing indicator
- [x] Character counter (0/2000)
- [x] Auto-scroll to latest message
- [x] "New Chat" functionality
- [x] Responsive design
- [x] Clean separation of concerns (services, routes, components)

### ⚠️ Assumptions & Cost Controls
- **Max input length**: 2000 characters (enforced frontend + backend)
- **Max output tokens**: 500 (limits AI response length)
- **Context window**: Last 10 messages only (reduces input cost)
- **No caching**: Each request hits LLM (acceptable for demo/low traffic)
- **No auth**: Single-user experience (simplified for assignment)

---

## 🎯 Design Decisions

### 1. **SvelteKit for Full-Stack**
**Why?** Single codebase for frontend + backend API routes. Faster development, easier deployment.

**Alternative considered:** Separate Express backend + React frontend (more complex setup)

### 2. **Drizzle ORM**
**Why?** Type-safe, lightweight, excellent TypeScript integration, easy migrations.

**Alternative considered:** Prisma (heavier, slower code generation)

### 3. **Gemini over Claude/OpenAI**
**Why?** Already had API key, generous free tier, good for prototyping.

**Alternative considered:** Claude (mentioned in assignment, but requires new account setup)

### 4. **localStorage for Session Management**
**Why?** Simple, works for single-user demo, no auth needed.

**Alternative considered:** Server-side sessions with cookies (overkill for this scope)

### 5. **Tailwind CSS v4**
**Why?** Modern, utility-first, rapid UI development.

**Trade-off:** Required `@tailwindcss/postcss` plugin (v4 breaking change)

---

## 🔒 Security & Validation

### Input Validation
- **Frontend**: Character counter, disabled states, trim whitespace
- **Backend**: 
  - Message must be 1-2000 characters
  - ConversationId must be valid UUID format
  - All inputs sanitized before DB insertion

### Environment Variables
- API keys never hardcoded
- `.env` in `.gitignore`
- `.env.example` provided for reference

### Error Messages
- User-friendly messages shown in UI
- Technical errors logged server-side only
- No sensitive info leaked to frontend

---

## 🚧 Trade-offs & Future Improvements

### Not Implemented (Due to Time/Scope)

**Redis Caching**
- **Why skipped**: Optional in requirements, adds deployment complexity
- **Impact**: Repeated questions hit LLM every time (higher cost/latency)
- **Future**: Add Redis for caching common FAQ responses

**Rate Limiting**
- **Why skipped**: Single-user demo, low traffic expected
- **Impact**: Vulnerable to spam/abuse in production
- **Future**: Implement rate limiting per IP/session (with Redis)

**Authentication**
- **Why skipped**: Not required, simplified UX
- **Impact**: All conversations publicly accessible (if deployed)
- **Future**: Add JWT-based auth for multi-user support

**Admin Dashboard**
- **Why skipped**: Not in requirements
- **Impact**: No way to view all conversations or analytics
- **Future**: Build admin panel to monitor usage, view conversations

**Response Streaming**
- **Why skipped**: Adds complexity, Gemini SDK makes it straightforward but requires SSE setup
- **Impact**: User waits for full response instead of seeing typing effect
- **Future**: Implement Server-Sent Events for streaming responses

**Conversation Search/Export**
- **Why skipped**: Not in requirements
- **Impact**: Users can't search message history or export conversations
- **Future**: Add full-text search, PDF export

**Multi-Channel Support**
- **Why skipped**: Demo is web-only
- **Impact**: Can't use on WhatsApp/Instagram (Spur's actual use case)
- **Future**: Abstract message handling to support multiple channels

---

## 🧪 Testing

### Manual Testing Checklist

**Functional Tests:**
- [x] Can send message and receive AI reply
- [x] Messages persist in database
- [x] Conversation history loads on page refresh
- [x] "New Chat" clears messages and starts fresh conversation
- [x] AI answers FAQ questions accurately

**FAQ Knowledge Tests:**
- [x] "What's your return policy?" → Mentions 30 days, unworn, tags
- [x] "Do you offer free shipping?" → Mentions $50 minimum, 5-7 days
- [x] "What are your support hours?" → Monday-Friday 9AM-6PM EST
- [x] "What payment methods?" → Lists all accepted methods
- [x] "Do you sell electronics?" → Says they don't have that info

**Error Handling Tests:**
- [x] Empty message doesn't send
- [x] Message over 2000 chars shows validation error
- [x] Invalid API key shows user-friendly error
- [x] Network timeout shows user-friendly error

**UX Tests:**
- [x] Enter key sends message
- [x] Auto-scrolls to latest message
- [x] Can't send while request in flight
- [x] "AI is typing..." indicator shows during wait
- [x] Messages have clear visual distinction (user vs AI)
- [x] Timestamps display correctly ("Just now", "2 mins ago")

---

## 📦 Deployment

### Database (Supabase)
1. Create project at supabase.com
2. Get connection string from Project Settings → Database
3. Add to `.env` as `DATABASE_URL`
4. Run `npm run db:push` to create tables

### Frontend + API (Vercel)
1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables:
   - `DATABASE_URL`
   - `GEMINI_API_KEY`
4. Deploy

**Deployed URL:** [Add your deployed URL here]

---

## 🐛 Known Issues

None currently! 🎉

---

## 📝 Environment Variables Reference
```bash
# Required
DATABASE_URL=postgresql://user:password@host:port/database
GEMINI_API_KEY=your_gemini_api_key

# Optional
NODE_ENV=development
```

### Getting API Keys

**Gemini API:**
1. Visit https://aistudio.google.com/app/apikey
2. Create API key
3. Copy key (starts with `AIzaSy...`)

**Supabase Database:**
1. Visit https://supabase.com/dashboard
2. Create new project
3. Settings → Database → Connection String (URI format)
4. Copy and replace `[YOUR-PASSWORD]` with your actual password

---

## 👨‍💻 Development

### Available Scripts
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio (DB GUI)
```

### Adding New FAQ Knowledge
Edit `src/lib/server/services/llm.service.ts` and update the `SYSTEM_PROMPT` with new store information.

### Changing LLM Provider
1. Install new SDK (e.g., `@anthropic-ai/sdk`)
2. Replace `llm.service.ts` implementation
3. Update environment variables

---

## 📄 License

This project was created as a take-home assignment for Spur.

---

## 🙏 Acknowledgments

Built for Spur's founding engineer position take-home assignment.

**Time spent:** ~10 hours
**Assignment deadline:** December 31, 2025
