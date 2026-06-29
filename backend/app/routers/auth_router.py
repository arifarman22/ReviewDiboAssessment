from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserWithToken, UserResponse
from app.schemas.response import APIResponse
from app.services.auth_service import AuthService
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=APIResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    result = await service.register(data)
    return APIResponse(
        success=True,
        message="User registered successfully",
        data=result.model_dump(),
    )


@router.post(
    "/login",
    response_model=APIResponse,
    summary="Login user and get JWT token",
)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    result = await service.login(data.email, data.password)
    return APIResponse(
        success=True,
        message="Login successful",
        data=result.model_dump(),
    )


@router.get(
    "/me",
    response_model=APIResponse,
    summary="Get current authenticated user",
)
async def get_me(current_user: User = Depends(get_current_user)):
    return APIResponse(
        success=True,
        message="User retrieved",
        data=UserResponse.model_validate(current_user).model_dump(),
    )
