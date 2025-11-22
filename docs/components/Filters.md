# Filters

Purpose
- Reusable filter controls used across the app to narrow feed results (by tag, industry or country).

Path
- `app/components/Filters.tsx`

Props (typical)
- `value?: string`
- `onChange?: (value: string) => void`

Usage
```tsx
<Filters value={tag} onChange={setTag} />
```

Notes
- Filters usually change the query params used when fetching posts from `GET /api/posts`.
