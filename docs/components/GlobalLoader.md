# GlobalLoader

Purpose
- A global loading indicator used while fetching data or waiting on long running operations.

Path
- `app/components/GlobalLoader.tsx`

Props (typical)
- `visible?: boolean`

Usage
```tsx
<GlobalLoader visible={loading} />
```

Notes
- Keep the UI subtle and accessible; prefer spinner and status text for screen readers.
