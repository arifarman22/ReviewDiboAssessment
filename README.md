# ReviewSphere — Product Review Platform

A full-stack review platform where users can browse products, read reviews, submit reviews, update and delete reviews. Built with Next.js 15 and FastAPI.

---

## 🔗 Live URLs

| Resource | URL |
|----------|-----|
| **Frontend (Next.js)** | [https://review-dibo-assessment-rtr9.vercel.app](https://review-dibo-assessment-rtr9.vercel.app) |
| **Backend API (FastAPI)** | [https://review-dibo-assessment.vercel.app](https://review-dibo-assessment.vercel.app) |
| **API Documentation (Swagger)** | [https://review-dibo-assessment.vercel.app/docs](https://review-dibo-assessment.vercel.app/docs) |
| **GitHub Repository** | [https://github.com/arifarman22/ReviewDiboAssessment](https://github.com/arifarman22/ReviewDiboAssessment) |

> ⚠️ The above URLs are live and deployed.

---

## 📁 Project Structure

```
ReviewSphere/
├── frontend/          # Next.js 15 (App Router, TypeScript, TailwindCSS)
│   ├── app/           # Pages & layouts
│   ├── components/    # Reusable UI components
│   ├── features/      # Feature-specific components (ReviewCard, ReviewForm)
│   ├── hooks/         # Custom hooks (useAuth, useAppContext, useDebounce)
│   ├── services/      # API layer (axios, productService, reviewService, authService)
│   ├── types/         # TypeScript interfaces
│   ├── constants/     # Mock data for offline fallback
│   └── utils/         # Utilities (localStorage DB)
│
├── backend/           # FastAPI (Python, SQLAlchemy 2.0, Neon PostgreSQL)
│   ├── app/
│   │   ├── config/        # Settings (pydantic-settings)
│   │   ├── core/          # Security (JWT, bcrypt)
│   │   ├── database/      # Async SQLAlchemy engine & session
│   │   ├── dependencies/  # Auth dependency injection
│   │   ├── exceptions/    # Custom exceptions & global handlers
│   │   ├── middleware/    # CORS + request logging
│   │   ├── models/        # SQLAlchemy ORM models (User, Product, Review)
│   │   ├── repositories/  # Data access layer
│   │   ├── routers/       # API route handlers
│   │   ├── schemas/       # Pydantic validation schemas
│   │   ├── services/      # Business logic layer
│   │   ├── utils/         # Database seeder
│   │   └── main.py        # App entry point
│   ├── alembic/           # Database migrations
│   ├── tests/             # API tests
│   └── vercel.json        # Vercel serverless config
│
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, TailwindCSS, React Hook Form, Zod, Axios, Framer Motion |
| Backend | FastAPI, SQLAlchemy 2.0 (Async), Pydantic v2, JWT Auth, bcrypt |
| Database | Neon (Serverless PostgreSQL) |
| Deployment | Vercel (Frontend + Backend) |

---

## ✨ Features

### Core
- ✅ Browse products with search, rating filter, sorting, pagination
- ✅ Product detail page with reviews and rating breakdown
- ✅ Submit reviews (authenticated users only)
- ✅ Edit / Delete own reviews
- ✅ One review per user per product (enforced)
- ✅ Auto-refresh review list & average rating after submission

### Authentication & Security
- ✅ JWT Authentication (Register / Login)
- ✅ Password hashing (bcrypt)
- ✅ Token-based authorization on all write endpoints
- ✅ Review ownership verification (edit/delete own reviews only)
- ✅ Admin role (product CRUD, review moderation)
- ✅ XSS protection (HTML sanitization on inputs)
- ✅ SQL injection protection (SQLAlchemy ORM)
- ✅ CORS policy (whitelisted origins only)
- ✅ Input validation (Pydantic v2)

### UI/UX
- ✅ Premium SaaS-level design (Linear/Vercel inspired)
- ✅ Dark mode
- ✅ Responsive (mobile-first)
- ✅ Loading skeletons with shimmer
- ✅ Toast notifications
- ✅ Framer Motion animations
- ✅ Error boundaries & states
- ✅ 404 page

---

## 🚀 Deployment on Vercel

### Deploy Frontend

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your repo → Select `frontend` as **Root Directory**
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL = https://your-backend.vercel.app/api
   ```
5. Deploy

### Deploy Backend

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import same repo → Select `backend` as **Root Directory**
3. Add environment variables:
   ```
   DATABASE_URL = postgresql+asyncpg://neondb_owner:password@ep-xxx.neon.tech/neondb?ssl=require
   SECRET_KEY = your-production-secret-key-min-32-chars
   API_PREFIX = /api
   DEBUG = false
   CORS_ORIGINS = ["https://your-frontend.vercel.app"]
   ACCESS_TOKEN_EXPIRE_MINUTES = 1440
   ALGORITHM = HS256
   DEFAULT_PAGE_SIZE = 10
   MAX_PAGE_SIZE = 100
   APP_NAME = ReviewSphere API
   APP_VERSION = 1.0.0
   ```
4. Deploy

### Database (Neon)

1. Sign up at [neon.tech](https://neon.tech) (free tier)
2. Create a project → copy connection string
3. Tables are **auto-created** on first API request
4. Data is **auto-seeded** (10 products, 6 users, 30 reviews)

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL (or Neon account)

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate    # macOS/Linux
pip install -r requirements.txt
```

Create `backend/.env` (copy from `.env.example`) and add your Neon connection string.

```bash
uvicorn app.main:app --reload --port 8000
```

- Swagger Docs: http://localhost:8000/docs
- Auto-creates tables & seeds data on first run

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

- App: http://localhost:3000

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login → JWT token |
| GET | `/api/auth/me` | 🔒 | Get current user |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | ❌ | List products (search, filter, sort, paginate) |
| GET | `/api/products/{id}` | ❌ | Product detail + reviews + rating breakdown |
| POST | `/api/products` | 🔒 Admin | Create product |
| PUT | `/api/products/{id}` | 🔒 Admin | Update product |
| DELETE | `/api/products/{id}` | 🔒 Admin | Delete product |

### Reviews
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/products/{id}/reviews` | 🔒 | Create review (1 per user per product) |
| POST | `/api/reviews` | 🔒 | Create review (alternative) |
| GET | `/api/reviews/{id}` | ❌ | Get review |
| PUT | `/api/reviews/{id}` | 🔒 Owner | Update own review |
| DELETE | `/api/reviews/{id}` | 🔒 Owner/Admin | Delete review |

### Query Parameters (GET /api/products)
| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search title/description |
| `rating` | int (1-5) | Filter by average rating |
| `sort_by` | string | `rating` \| `reviews` \| `name` \| `newest` |
| `page` | int | Page number (default: 1) |
| `limit` | int | Items per page (default: 10, max: 100) |

---

## 🗄️ Database Schema

### Users
| Column | Type | Constraints |
|--------|------|-------------|
| id | VARCHAR(36) | PK, UUID |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL, INDEXED |
| hashed_password | VARCHAR(255) | NOT NULL |
| is_admin | BOOLEAN | DEFAULT false |
| created_at | TIMESTAMP(tz) | DEFAULT now() |

### Products
| Column | Type | Constraints |
|--------|------|-------------|
| id | VARCHAR(36) | PK, UUID |
| title | VARCHAR(255) | NOT NULL |
| description | TEXT | NOT NULL |
| short_description | VARCHAR(500) | NULLABLE |
| image_url | VARCHAR(500) | NULLABLE |
| category | VARCHAR(100) | NULLABLE |
| price | FLOAT | DEFAULT 0 |
| created_at | TIMESTAMP(tz) | DEFAULT now() |

### Reviews
| Column | Type | Constraints |
|--------|------|-------------|
| id | VARCHAR(36) | PK, UUID |
| product_id | VARCHAR(36) | FK → products.id, CASCADE, INDEXED |
| user_id | VARCHAR(36) | FK → users.id, CASCADE, INDEXED |
| rating | INTEGER | CHECK (1-5) |
| comment | TEXT | NOT NULL |
| created_at | TIMESTAMP(tz) | DEFAULT now() |

### Migrations
Alembic migration in `backend/alembic/versions/001_initial.py`. Tables are also auto-created on application startup.

---

## ⚙️ Environment Configuration

### Backend (`backend/.env.example`)
```env
DATABASE_URL=postgresql+asyncpg://user:pass@host/db?ssl=require
SECRET_KEY=your-secret-key-min-32-characters
API_PREFIX=/api
APP_NAME=ReviewSphere API
APP_VERSION=1.0.0
DEBUG=false
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ALGORITHM=HS256
CORS_ORIGINS=["https://your-frontend.vercel.app"]
DEFAULT_PAGE_SIZE=10
MAX_PAGE_SIZE=100
```

### Frontend (`frontend/.env.example`)
```env
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
```

---

## 🧪 Testing

```bash
cd backend
pip install aiosqlite pytest pytest-asyncio httpx
pytest -v
```

A Postman collection is also available at `backend/postman_collection.json`.

---

## 📋 Seed Data (Auto-created on first run)

| Type | Count | Details |
|------|-------|---------|
| Admin | 1 | `admin@reviewsphere.com` / `admin123` |
| Users | 5 | `sarah@example.com`, `alex@example.com`, etc. / `password123` |
| Products | 10 | Various tech accessories |
| Reviews | 30 | Distributed across products |

---

## 🏗️ Architecture Decisions

- **Clean Architecture** — Repository → Service → Router separation
- **Async everywhere** — SQLAlchemy 2.0 async sessions + asyncpg
- **JWT stateless auth** — No server-side session storage needed
- **One review per product per user** — Enforced at service + DB level
- **Ownership verification** — Users can only edit/delete their own reviews
- **Optimistic UI** — Frontend updates immediately, reverts on failure
- **Offline fallback** — Frontend works with localStorage if backend is unavailable
