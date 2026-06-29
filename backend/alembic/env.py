import ssl as ssl_module
import asyncio
from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config
from alembic import context

from app.database.session import Base
from app.models import User, Product, Review  # noqa: F401
from app.config.settings import get_settings

settings = get_settings()
config = context.config

# Build the clean URL for asyncpg (strip query params for Neon)
db_url = settings.DATABASE_URL.split("?")[0] if "neon.tech" in settings.DATABASE_URL else settings.DATABASE_URL
config.set_main_option("sqlalchemy.url", db_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    # Build connect_args for Neon SSL
    connect_args = {}
    if "neon.tech" in settings.DATABASE_URL:
        ssl_context = ssl_module.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl_module.CERT_NONE
        connect_args["ssl"] = ssl_context

    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        connect_args=connect_args,
    )
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()


def run_migrations_online() -> None:
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
