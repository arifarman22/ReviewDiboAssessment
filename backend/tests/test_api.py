import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.database.session import Base, get_db
from app.main import app

# Use SQLite for testing
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

test_engine = create_async_engine(TEST_DATABASE_URL, echo=False)
TestSessionLocal = async_sessionmaker(bind=test_engine, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with TestSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


app.dependency_overrides[get_db] = override_get_db


@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_root(client: AsyncClient):
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


@pytest.mark.asyncio
async def test_health(client: AsyncClient):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


@pytest.mark.asyncio
async def test_register_user(client: AsyncClient):
    response = await client.post(
        "/api/auth/register",
        json={"name": "Test", "email": "test@test.com", "password": "password123"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert "access_token" in data["data"]


@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient):
    await client.post(
        "/api/auth/register",
        json={"name": "Test", "email": "dup@test.com", "password": "password123"},
    )
    response = await client.post(
        "/api/auth/register",
        json={"name": "Test2", "email": "dup@test.com", "password": "password456"},
    )
    assert response.status_code == 409


@pytest.mark.asyncio
async def test_login(client: AsyncClient):
    await client.post(
        "/api/auth/register",
        json={"name": "Test", "email": "login@test.com", "password": "password123"},
    )
    response = await client.post(
        "/api/auth/login",
        json={"email": "login@test.com", "password": "password123"},
    )
    assert response.status_code == 200
    assert response.json()["data"]["access_token"]


@pytest.mark.asyncio
async def test_get_products_empty(client: AsyncClient):
    response = await client.get("/api/products")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


@pytest.mark.asyncio
async def test_create_review_invalid_product(client: AsyncClient):
    # Register user first
    reg = await client.post(
        "/api/auth/register",
        json={"name": "Reviewer", "email": "rev@test.com", "password": "password123"},
    )
    user_id = reg.json()["data"]["user"]["id"]

    response = await client.post(
        "/api/reviews",
        json={
            "product_id": "non-existent-id",
            "user_id": user_id,
            "rating": 5,
            "comment": "Great product!",
        },
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_validation_error(client: AsyncClient):
    response = await client.post(
        "/api/reviews",
        json={"product_id": "x", "user_id": "y", "rating": 6, "comment": "hi"},
    )
    assert response.status_code == 422
