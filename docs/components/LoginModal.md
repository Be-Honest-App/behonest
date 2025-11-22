# LoginModal

Purpose
- A simple/mock login modal used for demonstration of user flows. Intended to be replaced with real auth later.

Path
- `app/components/LoginModal.tsx`

Props (typical)
- `open: boolean`
- `onClose?: () => void`

Usage
```tsx
<LoginModal open={show} onClose={() => setShow(false)} />
```

Notes
- This component is intended for demo; replace with real auth provider when needed.
