src/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout with theme provider
│   ├── page.tsx             # Home page
│   ├── shout/
│   │   └── page.tsx         # ShoutLink page
│   ├── business/
│   │   └── page.tsx         # Business page
│   └── contact/
│       └── page.tsx         # Contact page
├── components/
│   ├── Header.tsx           # Navigation and brand
│   ├── Hero.tsx             # Hero section (Home only)
│   ├── LeftCol.tsx          # Quick Post & Filters (Home only)
│   ├── RightCol.tsx         # Trending & Why (Home only)
│   ├── Feed.tsx             # Post feed (Home)
│   ├── ShoutLink.tsx        # ShoutLink form & preview
│   ├── BusinessMetrics.tsx  # Metrics & cards (Business)
│   ├── ContactForm.tsx      # Contact form
│   ├── LoginModal.tsx       # Mock login modal
│   └── ShareCard.tsx        # Reusable share card component
└── lib/
    └── utils.ts             # Utility functions (e.g., slug generation)