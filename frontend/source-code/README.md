# Alfred Platform - Source Code

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   └── shared/          # Reusable UI components
│       ├── TicketCard.tsx
│       ├── StatusPill.tsx
│       ├── Navbar.tsx
│       ├── SidebarNav.tsx
│       ├── Footer.tsx
│       └── ...
├── pages/
│   ├── marketing/       # Public pages
│   │   ├── Home.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Charities.tsx
│   │   ├── Pricing.tsx
│   │   ├── Trust.tsx
│   │   └── Login.tsx
│   ├── dashboard/       # User dashboard
│   │   ├── DashboardHome.tsx
│   │   ├── MyScores.tsx
│   │   ├── MyCharity.tsx
│   │   ├── Draws.tsx
│   │   ├── Winnings.tsx
│   │   └── Settings.tsx
│   └── admin/           # Admin console
│       ├── AdminOverview.tsx
│       ├── AdminUsers.tsx
│       ├── AdminDraws.tsx
│       ├── AdminCharities.tsx
│       ├── AdminWinners.tsx
│       └── AdminReports.tsx
├── lib/
│   ├── auth.tsx         # Authentication context
│   ├── mock-data.ts     # Mock data
│   ├── types.ts         # TypeScript types
│   └── utils.ts         # Utility functions
├── App.tsx              # Main app component with routing
├── main.tsx             # Entry point
└── index.css            # Global styles & design tokens

public/
├── hero-golf.mp4        # Hero video
└── community-fun.mp4    # Act II video
```

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS v4** for styling
- **React Router v7** for routing
- **Framer Motion** for animations
- **Recharts** for admin charts
- **Lucide React** for icons

## Design Tokens

All design tokens are defined in `src/index.css`:

- Colors: `--color-bg`, `--color-accent-deep`, `--color-gold`, etc.
- Typography: Fraunces (display), Inter (body), IBM Plex Mono (numbers)
- Spacing: 8px base scale
- Shadows: Ambient shadow system

## Authentication

**Admin Access:**
- Email: `updeshsingh9063@gmail.com`
- Password: `Senu@9063`
- Select "Admin" role on login page

**User Access (Demo):**
- Any email/password works
- Select "User" role on login page

## Key Features

### Marketing Site
- Video hero background
- 3-act narrative (Play → Give → Win)
- Charity directory with search/filter
- Pricing with monthly/yearly toggle
- Trust & transparency page

### User Dashboard
- Score entry (rolling 5, Stableford format)
- Charity selection & contribution tracking
- Draw history & results
- Winnings management
- Account settings

### Admin Console
- User management with score editing
- Draw configuration (random/algorithmic)
- Charity CRUD operations
- Winner verification
- Analytics & reports

## Routing

```
/                      # Homepage
/how-it-works          # How it works
/charities             # Charity directory
/charities/:id         # Charity profile
/pricing               # Subscription plans
/trust                 # Trust & transparency
/login                 # Login/Signup

/dashboard             # User dashboard home
/dashboard/scores      # Score entry
/dashboard/charity     # Charity management
/dashboard/draws       # Draw history
/dashboard/winnings    # Winnings
/dashboard/settings    # Account settings

/admin                 # Admin overview
/admin/users           # User management
/admin/draws           # Draw management
/admin/charities       # Charity management
/admin/winners         # Winner verification
/admin/reports         # Analytics
```

## Development Notes

- All data is mocked in `src/lib/mock-data.ts`
- Authentication is handled via React Context (`src/lib/auth.tsx`)
- Protected routes redirect to login if not authenticated
- Role-based access control (user vs admin)
- Responsive design: mobile-first approach
- Full-width layout optimized for all screen sizes

## Build Output

The `dist/` folder contains the production build:
- Minified JavaScript and CSS
- Optimized assets
- Ready for deployment

## Deployment

The app can be deployed to any static hosting service:
- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages

Just build with `npm run build` and deploy the `dist/` folder.
