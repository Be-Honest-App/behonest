# Product Requirements Document (PRD) — Be-Honest

Last updated: 2025-11-22

Overview
- Be-Honest is a lightweight social feed built with Next.js (App Router), TypeScript, Tailwind CSS and MongoDB. The app enables short 'posts' (shouts) tagged by industry or topic and supports real-time updates via Pusher for likes, shares and new posts.

Purpose and Objectives
- Purpose: Provide a minimal, fast and private-friendly feed where users can publish short posts and interact (like/share) while seeing near real-time updates.
- Objectives:
  - Deliver an MVP feed with create/read/list operations and real-time updates.
  - Support simple user interactions: like and share counts.
  - Keep the implementation simple to deploy and maintain (Next.js + MongoDB + Pusher).

Target Users / Personas
- Casual Poster: wants to quickly share a note or link tied to an industry tag.
- Browser-only Consumer: reads the feed and interacts without account friction.
- Product Manager / Admin: monitors content and metrics.

Key User Stories (MVP)
- As a user, I can create a post with a tag, content and optional business name.
- As a visitor, I can view a reverse-chronological feed of posts.
- As a visitor, I can like a post and see the updated like count quickly.
- As a visitor, I can share a post and see the share count updated.

Scope (MVP vs Future)
- MVP (must-have):
  - Post create endpoint `POST /api/posts` with server-side validation and DB persistence.
  - Feed listing `GET /api/posts` with optional `tag` / `industry` and `country` filters.
  - Like endpoint `POST /api/posts/:id/like` and share endpoint `POST /api/posts/:id/share`.
  - Real-time broadcasting of `new-post`, `update-like`, `update-share` via Pusher.
  - Frontend components: Feed, FeedHeader (filters), PostContent, PostActions, LeftCol (quick-post), RightCol (trending/info).

- Future (nice-to-have):
  - Moderation and reporting tools
  - Persistent per-user liked state and undo like
  - Rich content (links preview, images)
  - Rate limiting and abuse prevention

Functional Requirements
- FR1: The server must accept valid post payloads and store them in MongoDB.
- FR2: The `GET /api/posts` endpoint must return serialized posts with stable `id` strings and ISO timestamps.
- FR3: Like/share endpoints must atomically update counters and broadcast updates.
- FR4: The frontend feed must subscribe to Pusher and update the UI on relevant events.

Non-Functional Requirements
- NFR1: Feed loads in under 1s for first 10 posts on a typical dev machine.
- NFR2: API responses use JSON and include consistent serialized shapes.
- NFR3: Error handling logs server errors and returns meaningful HTTP status codes.

Data Model (summary)
- Post (Mongoose model `models/Post.ts`):
  - `_id: ObjectId` stored; serialized as string for clients
  - `tag: string` (required)
  - `businessName?: string | null`
  - `country: string` (required)
  - `time: string` (ISO string for display)
  - `content: string` (required)
  - `likes: number` (default 0)
  - `shares: number` (default 0)
  - `likedBy: string[]` (optional list of identifiers)

APIs (surface)
- POST /api/posts
  - Request: JSON post payload
  - Response: serialized post and success flag
  - Side-effect: broadcast `new-post` via Pusher

- GET /api/posts?tag=...&country=...
  - Response: { data: Post[] }

- POST /api/posts/:id/like
  - Request: { liked: boolean } or simple POST to toggle/increment
  - Response: updated post fields or success
  - Side-effect: broadcast `update-like`

- POST /api/posts/:id/share
  - Response: updated share count
  - Side-effect: broadcast `update-share`

Realtime Events (Pusher)
- Channel: `posts-channel`
- Events:
  - `new-post` — payload: serialized post
  - `update-like` — payload: { _id, likes, likedBy? }
  - `update-share` — payload: { _id, shares }

UI / UX Requirements
- Feed shows newest posts first with: tag, optional business name, time (relative or ISO), content, likes, shares and action buttons.
- Post create UI is available in `LeftCol` with minimal fields: tag, content, optional businessName, country.
- Actions must provide optimistic UI updates or rely on Pusher updates for eventual consistency.

Acceptance Criteria (MVP)
- AC1: A user can create a post and the post appears in the feed within ~2 seconds.
- AC2: Liking a post increments the like count and other connected clients see the update via Pusher.
- AC3: Sharing increments the share count and broadcasts to connected clients.
- AC4: Filter by tag and/or country returns a subset of posts matching criteria.

Metrics & Success Criteria
- Daily active readers (DAU)
- Posts created per day
- Average time to reflect a like/share on other clients (target < 2s)
- Error rate on API endpoints (target < 0.1%)

Security & Privacy
- Do not log or expose sensitive user info. Current app is anonymous by design.
- Sanitize and validate inputs server-side to prevent injection.

Operational Considerations
- Environment variables required: `MONGODB_URI`, `PUSHER_APP_ID`, `PUSHER_SECRET`, `NEXT_PUBLIC_PUSHER_KEY`, `NEXT_PUBLIC_PUSHER_CLUSTER`.
- MongoDB connection pooling and timeouts are configured in `lib/mongodb.ts`.

Roadmap & Milestones
- Week 1 (MVP): Finalize API, wire up feed and real-time updates, basic UI flows.
- Week 2: Add client-side optimistic updates and filtering polish. Add basic monitoring/logging.
- Week 3: Consider lightweight auth, rate limiting and moderation tools.

Risks & Mitigations
- Risk: Realtime costs and rate limiting on Pusher — Mitigation: use channel/event aggregation and server-side rate limiting.
- Risk: Spam/abuse — Mitigation: add rate limits, captchas, and moderation flows before public launch.

Open Questions
- Do we require durable user accounts and persistent per-user likes for launch?
- What is the desired content policy and moderation workflow?

Appendix — Implementation Notes
- Follow the existing code structure: `app/api/posts/*` for endpoints, `lib/*` for infra helpers and `models/Post.ts` for the schema.
- Docs and component-level markdown exist under `docs/components/`.

---

If you want, I can:
- Expand this PRD into individual tickets (Jira/GitHub issues) and estimate effort per ticket.
- Create a simple roadmap board, or draft API contract OpenAPI schema for the endpoints.
