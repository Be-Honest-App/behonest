# ThemeProvider

Purpose
- Provides theme context (light/dark) to the application and persists user preference.

Path
- `app/components/ThemeProvider.tsx`

Props (typical)
- `children: React.ReactNode`

Usage
```tsx
<ThemeProvider>
  <App />
</ThemeProvider>
```

Notes
- The project uses `next-themes` to persist theme preference. The `ThemeToggle` component hooks into this provider.
