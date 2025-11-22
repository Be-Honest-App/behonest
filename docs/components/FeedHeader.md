# FeedHeader

Purpose
- Controls and filters for the feed. Provides UI for searching, filtering by tag/industry/country, and other feed-level controls.

Path
- `app/components/Post/FeedHeader.tsx`

Props (typical)
- `onFilterChange?: (filters: Record<string, string>) => void`

Usage
```tsx
<FeedHeader onFilterChange={(f) => mutate(`/api/posts?tag=${f.tag}`)} />
```

Notes
- Use this component to drive the query params passed to the feed's data loader.
