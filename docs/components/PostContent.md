# PostContent

Purpose
- Renders the textual content (and any markup) of a post in the feed or post detail view.

Path
- `app/components/PostContent.tsx`

Props (typical)
- `content: string` — raw content string to render

Usage
```tsx
<PostContent content={post.content} />
```

Notes
- Sanitize or escape content if accepting user HTML. The project currently stores plain text content.
