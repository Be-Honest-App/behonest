# Feed

Purpose
- Renders the list of posts. Subscribes to real-time updates (Pusher) and updates the feed when posts are created, liked, or shared.

Path
- `app/components/Post/Feed.tsx`

Props (typical)
- `Posts: Post[]` — initial list of posts fetched from the server
- `onSelect?: (postId: string) => void` — optional callback when a post is selected

Usage
```tsx
<Feed Posts={posts} />
```

Notes
- The component expects serialized post objects (IDs as strings and ISO time strings).
- It likely uses `swr` for revalidation and listens to Pusher `posts-channel` events such as `new-post`, `update-like`, and `update-share`.
