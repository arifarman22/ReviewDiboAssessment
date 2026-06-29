from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError

from app.config.settings import get_settings
from app.middleware.cors import setup_cors
from app.exceptions import (
    validation_exception_handler,
    integrity_error_handler,
    generic_exception_handler,
)
from app.routers import auth_router, product_router, review_router

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="ReviewSphere API - Product Review Platform",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
setup_cors(app)

# Exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(IntegrityError, integrity_error_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Routers
app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(product_router, prefix=settings.API_PREFIX)
app.include_router(review_router, prefix=settings.API_PREFIX)


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


@app.get("/seed", tags=["Admin"])
async def seed_db():
    """Manually trigger database seed (call once after first deploy)."""
    from app.database import engine, Base, AsyncSessionLocal
    from app.utils.seed import seed_database
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        async with AsyncSessionLocal() as session:
            await seed_database(session)
        return {"success": True, "message": "Database seeded"}
    except Exception as e:
        return {"success": False, "message": str(e)}
