# ReviewSphere Backend API

Production-ready REST API for a Product Review Platform built with FastAPI, Neon (Serverless PostgreSQL), SQLAlchemy 2.0, and Pydantic v2.

## Tech Stack

- **Python** 3.13
- **FastAPI** — async web framework
- **Neon** — serverless PostgreSQL (cloud)
- **SQLAlchemy 2.0** — async ORM
- **Alembic** — database migrations
- **Pydantic v2** — validation & serialization
- **JWT** — authentication (python-jose + passlib/bcrypt)
- **Uvicorn** — ASGI server

## Setup Instructions

### 1. Create Neon Database

1. Go to https://neon.tech and sign up (free tier available)
2. Create a new project
3. In the Dashboard → **Connection Details**:
   - Select driver: **asyncpg**
   - Copy the connection string

It will look like:
```
postgresql+asyncpg://neondb_owner:abc123@ep-cool-name-12345.us-east-1.aws.neon.tech/neondb?ssl=require
```

### 2. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

Edit `.env` and paste your Neon connection string:

```env
DATABASE_URL=postgresql+asyncpg://neondb_owner:YOUR_PASSWORD@ep-YOUR-ENDPOINT.us-east-1.aws.neon.tech/neondb?ssl=require
```

### 5. Run the Server

```bash
uvicorn app.main:app --reload --port 8000
```

On first startup, the app will:
- ✅ Auto-create all database tables on Neon
- ✅ Seed 6 users, 10 products, and 30 reviews

### 6. Access the API

- **API Root**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT |
| GET | `/api/auth/me` | Get current user (requires token) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (search, filter, sort, paginate) |
| GET | `/api/products/{id}` | Product detail with reviews & rating breakdown |
| POST | `/api/products/{id}/reviews` | Create a review for a product |
| POST | `/api/products` | Create product (Admin only) |
| PUT | `/api/products/{id}` | Update product (Admin only) |
| DELETE | `/api/products/{id}` | Delete product (Admin only) |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews` | Create review |
| GET | `/api/reviews/{id}` | Get review |
| PUT | `/api/reviews/{id}` | Update review |
| DELETE | `/api/reviews/{id}` | Delete review |

## Query Parameters

**GET /api/products**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search by title/description |
| `rating` | int (1-5) | Filter by average rating |
| `sort_by` | string | `rating` \| `reviews` \| `name` \| `newest` |
| `page` | int | Page number (default: 1) |
| `limit` | int | Items per page (default: 10, max: 100) |

## Seed Data (Auto-created on first run)

| Type | Credentials |
|------|-------------|
| Admin | `admin@reviewsphere.com` / `admin123` |
| User | `sarah@example.com` / `password123` |
| User | `alex@example.com` / `password123` |
| User | `sophia@example.com` / `password123` |
| User | `david@example.com` / `password123` |
| User | `emily@example.com` / `password123` |

Plus 10 products and 30 reviews.

## Project Structure

```
backend/
├── app/
│   ├── config/          # Settings (pydantic-settings)
│   ├── core/            # Security (JWT, bcrypt)
│   ├── database/        # Async engine & session (Neon-optimized)
│   ├── dependencies/    # Auth dependency injection
│   ├── exceptions/      # Custom exceptions & global handlers
│   ├── middleware/       # CORS + request logging
│   ├── models/          # SQLAlchemy ORM models
│   ├── repositories/    # Data access layer
│   ├── routers/         # API route handlers
│   ├── schemas/         # Pydantic validation schemas
│   ├── services/        # Business logic layer
│   ├── utils/           # Seed data
│   └── main.py          # App entry point
├── alembic/             # Database migrations
├── tests/               # API tests
├── requirements.txt
├── .env                 # Your Neon connection string goes here
└── .env.example
```

## Running Migrations (Optional)

Tables are auto-created on startup. If you prefer Alembic:

```bash
alembic upgrade head
```

## Running Tests

```bash
pip install aiosqlite
pytest -v
```

## Connecting Frontend

Set in the frontend `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Why Neon?

- **No local PostgreSQL install needed** — fully cloud-hosted
- **Free tier** — 0.5 GB storage, always available
- **Serverless** — auto-scales, suspends when idle
- **Branching** — create database branches for dev/staging
- **SSL by default** — secure connections out of the box
