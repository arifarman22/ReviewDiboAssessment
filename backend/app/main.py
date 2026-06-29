from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError
from loguru import logger
import sys

from app.config.settings import get_settings
from app.database import engine, Base, AsyncSessionLocal
from app.middleware import setup_cors, RequestLoggingMiddleware
from app.exceptions import (
    validation_exception_handler,
    integrity_error_handler,
    generic_exception_handler,
)
from app.routers import auth_router, product_router, review_router
from app.utils.seed import seed_database

settings = get_settings()

# Configure loguru
logger.remove()
logger.add(
    sys.stdout,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
    level="DEBUG" if settings.DEBUG else "INFO",
)

# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="""
## ReviewSphere API

A production-ready REST API for a Product Review Platform.

### Features
- JWT Authentication (Register/Login)
- Product CRUD (Admin)
- Review Management (Create/Update/Delete)
- Search, Filter, Sort, Pagination
- Rating Breakdowns & Statistics
    """,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Setup middleware
setup_cors(app)
app.add_middleware(RequestLoggingMiddleware)

# Register exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(IntegrityError, integrity_error_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Register routers
app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(product_router, prefix=settings.API_PREFIX)
app.include_router(review_router, prefix=settings.API_PREFIX)

# Track if DB has been initialized this cold start
_db_initialized = False


async def ensure_db_ready():
    """Create tables and seed on first request (serverless-compatible startup)."""
    global _db_initialized
    if _db_initialized:
        return
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        async with AsyncSessionLocal() as session:
            await seed_database(session)
        _db_initialized = True
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization error: {e}")


@app.on_event("startup")
async def startup():
    await ensure_db_ready()


@app.get("/", tags=["Health"])
async def root():
    return {
        "success": True,
        "message": f"{settings.APP_NAME} is running",
        "version": settings.APP_VERSION,
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "service": settings.APP_NAME}
