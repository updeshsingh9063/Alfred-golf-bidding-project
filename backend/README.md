# Alfred Golf — Backend API

> Express.js + MongoDB REST API for the Alfred Golf Subscription Lottery Platform

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** running locally on port `27017` (or provide a remote URI)

### Setup

```bash
# 1. Navigate to the backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Copy .env and fill in your values (MongoDB URI, JWT secret, Stripe keys, etc.)

# 4. Seed the database with sample data
npm run seed

# 5. Start the development server
npm run dev
```

The API will be available at **http://localhost:5000**

---

## 📋 Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/alfred_golf` |
| `JWT_SECRET` | Secret for JWT signing | *(required)* |
| `JWT_EXPIRES_IN` | JWT expiry duration | `7d` |
| `STRIPE_SECRET_KEY` | Stripe secret key | *(required for payments)* |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | *(required for webhooks)* |
| `STRIPE_MONTHLY_PRICE_ID` | Stripe Price ID for monthly plan | *(required for payments)* |
| `STRIPE_YEARLY_PRICE_ID` | Stripe Price ID for yearly plan | *(required for payments)* |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_USER` | SMTP username | *(required for emails)* |
| `EMAIL_PASS` | SMTP password | *(required for emails)* |

---

## 🔑 Default Credentials (After Seeding)

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@alfred.golf` | `Admin@1234` |
| **Subscriber** | `jordan@example.com` | `Password@123` |
| **Subscriber** | `alice@example.com` | `Password@123` |

---

## 📡 API Endpoints

### Health
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | API health check |

### Authentication (`/api/auth`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login (returns JWT) |
| POST | `/api/auth/logout` | Bearer | Logout |
| GET | `/api/auth/me` | Bearer | Get current user |
| POST | `/api/auth/refresh-token` | — | Refresh JWT token |
| POST | `/api/auth/forgot-password` | — | Request password reset |
| POST | `/api/auth/reset-password/:token` | — | Reset password |
| PATCH | `/api/auth/change-password` | Bearer | Change password |

### Users (`/api/users`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users/profile` | Bearer | Get own profile |
| PATCH | `/api/users/profile` | Bearer | Update profile |
| PATCH | `/api/users/charity` | Bearer | Update charity preference |
| GET | `/api/users/dashboard` | Bearer + Sub | Full dashboard data |
| GET | `/api/users/winnings` | Bearer | Personal winnings history |

### Scores (`/api/scores`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/scores` | Bearer + Sub | Get my 5 scores |
| POST | `/api/scores` | Bearer + Sub | Add new score (rolling window) |
| PATCH | `/api/scores/:id` | Bearer + Sub | Update a score |
| DELETE | `/api/scores/:id` | Bearer + Sub | Delete a score |
| GET | `/api/scores/draw-numbers` | Bearer + Sub | Get my draw entry numbers |

### Subscriptions (`/api/subscriptions`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/subscriptions/plans` | — | Get available plans |
| GET | `/api/subscriptions/my` | Bearer | Get my subscription |
| POST | `/api/subscriptions/create` | Bearer | Create subscription (demo) |
| POST | `/api/subscriptions/cancel` | Bearer | Cancel subscription |
| POST | `/api/subscriptions/create-checkout` | Bearer | Create Stripe Checkout session |
| GET | `/api/subscriptions/billing` | Bearer | Get billing history |

### Charities (`/api/charities`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/charities` | — | List charities (search/filter) |
| GET | `/api/charities/featured` | — | Get featured charity |
| GET | `/api/charities/categories` | — | Get charity categories |
| GET | `/api/charities/:slug` | — | Get charity by slug |
| GET | `/api/charities/id/:id` | — | Get charity by ID |

### Draws (`/api/draws`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/draws` | — | List public draws |
| GET | `/api/draws/upcoming` | — | Get next upcoming draw |
| GET | `/api/draws/:id` | — | Get draw by ID |
| GET | `/api/draws/my/history` | Bearer + Sub | My draw participation history |
| GET | `/api/draws/my/entry` | Bearer + Sub | My numbers for upcoming draw |

### Winners (`/api/winners`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/winners` | — | Public recent winners |
| GET | `/api/winners/my` | Bearer | My winner records |
| POST | `/api/winners/:id/upload-proof` | Bearer + Sub | Upload verification proof |

### Admin (`/api/admin`) — Admin role required
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/analytics` | Platform analytics |
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/users/:id` | User detail |
| PATCH | `/api/admin/users/:id` | Update user |
| PATCH | `/api/admin/users/:id/subscription` | Update subscription |
| PATCH | `/api/admin/users/:id/scores/:scoreId` | Edit user score |
| GET | `/api/admin/draws` | List all draws |
| POST | `/api/admin/draws` | Create draw |
| PATCH | `/api/admin/draws/:id` | Update draw |
| POST | `/api/admin/draws/:id/simulate` | Simulate draw |
| POST | `/api/admin/draws/:id/publish` | Publish draw |
| GET | `/api/admin/draws/participants` | List eligible participants |
| POST | `/api/admin/charities` | Create charity |
| PATCH | `/api/admin/charities/:id` | Update charity |
| DELETE | `/api/admin/charities/:id` | Deactivate charity |
| PATCH | `/api/admin/charities/:id/feature` | Set featured charity |
| GET | `/api/admin/winners` | List all winners |
| PATCH | `/api/admin/winners/:id/verify` | Approve/reject/pay winner |

### Webhooks (`/api/webhooks`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/webhooks/stripe` | Stripe webhook handler |

---

## 🏗️ Project Structure

```
backend/
├── server.js                    # Entry point
├── .env                         # Environment variables
├── src/
│   ├── app.js                   # Express app config
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── User.model.js        # User + subscription denorm
│   │   ├── Score.model.js       # Stableford score (rolling 5)
│   │   ├── Charity.model.js     # Charity with events
│   │   ├── Draw.model.js        # Monthly draw + entries
│   │   ├── Winner.model.js      # Winner verification workflow
│   │   └── Subscription.model.js # Stripe subscription + billing
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT protect, adminOnly, requireSubscription
│   │   ├── error.middleware.js  # Global error handler
│   │   └── notFound.middleware.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── score.controller.js
│   │   ├── charity.controller.js
│   │   ├── draw.controller.js
│   │   ├── winner.controller.js
│   │   ├── subscription.controller.js
│   │   └── admin.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── score.routes.js
│   │   ├── charity.routes.js
│   │   ├── draw.routes.js
│   │   ├── winner.routes.js
│   │   ├── subscription.routes.js
│   │   ├── admin.routes.js
│   │   └── webhook.routes.js    # Stripe webhooks
│   ├── services/
│   │   ├── score.service.js     # Rolling window logic
│   │   ├── draw.service.js      # Lottery engine
│   │   └── email.service.js     # Email templates
│   ├── utils/
│   │   └── jwt.utils.js
│   └── seeders/
│       └── seed.js              # Database seeder
└── uploads/
    └── proof/                   # Winner proof uploads
```

---

## ⚙️ Draw Engine

The draw engine (`src/services/draw.service.js`) supports two modes:

1. **Random** — Standard lottery (5 unique numbers 1–45)
2. **Algorithmic** — Weighted by historical score frequency (most + least common scores)

### Prize Tiers
| Tier | Matches | Pool Share | Rollover? |
|---|---|---|---|
| Jackpot (5-match) | 5/5 | 40% | ✅ Yes |
| Second (4-match) | 4/5 | 35% | ❌ No |
| Third (3-match) | 3/5 | 25% | ❌ No |

Admin workflow: **Simulate → Review → Publish**

---

## 🔐 Auth Flow

```
Register → JWT token returned → Include as Bearer in all protected requests
```

- Tokens expire in 7 days (configurable via `JWT_EXPIRES_IN`)
- Refresh tokens valid for 30 days
- Password reset tokens expire in 1 hour

---

## 📦 Score Rules (per PRD)

- Maximum 5 active scores per user at any time
- Scores range: **1–45** (Stableford format)
- Only one score per date (duplicate dates rejected with 409)
- Adding a 6th score automatically removes the oldest
- Admin can edit any user's scores
