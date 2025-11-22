# ClientLoaderWrapper

Purpose
- Wrapper used to safely render client-only components in Next.js App Router. Useful when a component depends on browser-only APIs.

Path
- `app/components/ClientLoaderWrapper.tsx`

Props (typical)
- `children: React.ReactNode`

Usage
```tsx
<ClientLoaderWrapper>
  <ClientOnlyComponent />
</ClientLoaderWrapper>
```

Notes
- Use for components that require `window`, `localStorage`, or other browser-only features.
