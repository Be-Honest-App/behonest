# MobileLeftColToggle

Purpose
- Mobile control to toggle visibility of the left column (quick-post / filters) on small screens.

Path
- `app/components/MobileLeftColToggle.tsx`

Props (typical)
- `isOpen: boolean`
- `onToggle: () => void`

Usage
```tsx
<MobileLeftColToggle isOpen={open} onToggle={() => setOpen(!open)} />
```

Notes
- Integrates with CSS transitions; keep interaction accessible.
