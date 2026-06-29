import ssl as ssl_module
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.config.settings import get_settings

settings = get_settings()

# Build connect_args for Neon SSL
connect_args = {}
if "neon.tech" in settings.DATABASE_URL:
    # asyncpg requires ssl context for Neon
    ssl_context = ssl_module.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl_module.CERT_NONE
    connect_args["ssl"] = ssl_context

# Strip query params that asyncpg doesn't understand from URL
db_url = settings.DATABASE_URL.split("?")[0] if "neon.tech" in settings.DATABASE_URL else settings.DATABASE_URL

engine = create_async_engine(
    db_url,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=5,
    pool_recycle=300,
    connect_args=connect_args,
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
