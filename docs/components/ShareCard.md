# ShareCard

Purpose
- Small card used for rendering a post preview when sharing or showing a condensed post preview.

Path
- `app/components/ShareCard.tsx`

Props (typical)
- `post: Post` — post object used to populate the preview

Usage
```tsx
<ShareCard post={post} />
```

Notes
- Designed for reuse across share UI; keep markup compact for embedding in share flows.
