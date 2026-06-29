from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.schemas.response import APIResponse
from app.services.auth_service import AuthService
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, db: Session = Depends(get_db)):
    service = AuthService(db)
    result = service.register(data)
    return APIResponse(success=True, message="User registered successfully", data=result.model_dump())


@router.post("/login", response_model=APIResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    service = AuthService(db)
    result = service.login(data.email, data.password)
    return APIResponse(success=True, message="Login successful", data=result.model_dump())


@router.get("/me", response_model=APIResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return APIResponse(
        success=True, message="User retrieved",
        data=UserResponse.model_validate(current_user).model_dump(),
    )
