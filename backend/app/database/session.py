from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from app.config.settings import get_settings

settings = get_settings()

# Convert async URL to sync format
db_url = settings.DATABASE_URL
# postgresql+asyncpg:// → postgresql://
# postgresql+psycopg:// → postgresql://
if "+asyncpg" in db_url:
    db_url = db_url.replace("postgresql+asyncpg://", "postgresql://")
elif "+psycopg" in db_url:
    db_url = db_url.replace("postgresql+psycopg://", "postgresql://")

# Keep sslmode param, drop others
if "?" in db_url:
    base, params = db_url.split("?", 1)
    kept = [p for p in params.split("&") if "ssl" in p.lower()]
    db_url = base + ("?" + "&".join(kept) if kept else "")

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
