from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from app.config.settings import get_settings

settings = get_settings()

# Normalize URL for psycopg2
db_url = settings.DATABASE_URL

# Strip driver prefixes to plain postgresql://
if "+asyncpg" in db_url:
    db_url = db_url.replace("postgresql+asyncpg://", "postgresql://")
elif "+psycopg://" in db_url:
    db_url = db_url.replace("postgresql+psycopg://", "postgresql://")

# Fix query params: remove all and just add sslmode=require for Neon
if "neon.tech" in db_url:
    db_url = db_url.split("?")[0] + "?sslmode=require"

engine = create_engine(
    db_url,
    echo=False,
    pool_pre_ping=True,
    pool_size=3,
    max_overflow=2,
)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
