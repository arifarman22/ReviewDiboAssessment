from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import NullPool
from app.config.settings import get_settings

settings = get_settings()

# Convert URL to use psycopg async driver
# Input: postgresql+asyncpg://... → postgresql+psycopg://...
# Input: postgresql://... → postgresql+psycopg://...
db_url = settings.DATABASE_URL
if "asyncpg" in db_url:
    db_url = db_url.replace("postgresql+asyncpg://", "postgresql+psycopg://")
elif db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+psycopg://", 1)

# Remove query params that may cause issues, keep sslmode
# psycopg handles sslmode=require natively
if "?" in db_url:
    base, params = db_url.split("?", 1)
    # Keep only sslmode param
    kept = [p for p in params.split("&") if p.startswith("sslmode")]
    db_url = base + ("?" + "&".join(kept) if kept else "")

engine = create_async_engine(
    db_url,
    echo=False,
    pool_pre_ping=True,
    poolclass=NullPool,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
