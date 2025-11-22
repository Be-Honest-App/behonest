# PostActions

Purpose
- UI for interacting with a post: like, share, and possibly comment actions. Triggers API requests to update counts and broadcasts via Pusher.

Path
- `app/components/PostActions.tsx`

Props (typical)
- `postId: string`
- `likes: number`
- `shares: number`

Usage
```tsx
<PostActions postId={post._id} likes={post.likes} shares={post.shares} />
```

Notes
- These actions call `POST /api/posts/:id/like` and `POST /api/posts/:id/share` and rely on the feed to update via real-time events or local mutate.
