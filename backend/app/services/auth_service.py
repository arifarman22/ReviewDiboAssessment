from sqlalchemy.orm import Session
import re
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserWithToken
from app.repositories.user_repository import UserRepository
from app.core.security import hash_password, verify_password, create_access_token
from app.exceptions import NotFoundException, BadRequestException, ConflictException


def sanitize_text(text: str) -> str:
    return re.sub(r'<[^>]+>', '', text).strip()


class AuthService:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def register(self, data: UserCreate) -> UserWithToken:
        existing = self.repo.get_by_email(data.email)
        if existing:
            raise ConflictException(detail="A user with this email already exists")

        user = User(
            name=sanitize_text(data.name),
            email=data.email,
            hashed_password=hash_password(data.password),
        )
        user = self.repo.create(user)

        token = create_access_token({"sub": user.id, "email": user.email})
        return UserWithToken(
            user=UserResponse.model_validate(user),
            access_token=token,
        )

    def login(self, email: str, password: str) -> UserWithToken:
        user = self.repo.get_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            raise BadRequestException(detail="Invalid email or password")

        token = create_access_token({"sub": user.id, "email": user.email})
        return UserWithToken(
            user=UserResponse.model_validate(user),
            access_token=token,
        )

    def get_user(self, user_id: str) -> User:
        user = self.repo.get_by_id(user_id)
        if not user:
            raise NotFoundException(detail=f"User not found")
        return user
