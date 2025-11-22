# LeftCol

Purpose
- Left column content for the home page. Often includes quick-post area, filters, and navigation controls for creating or filtering posts.

Path
- `app/components/LeftCol.tsx`

Props (typical)
- `onCreate?: (postData: any) => void` — callback for quick-post submissions

Usage
```tsx
<LeftCol />
```

Notes
- On mobile, `MobileLeftColToggle` is used to toggle the visibility of this column.
