from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.core.security import decode_access_token
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.exceptions import UnauthorizedException, ForbiddenException

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    if not token:
        raise UnauthorizedException(detail="Authentication required")

    payload = decode_access_token(token)
    if not payload:
        raise UnauthorizedException(detail="Invalid or expired token")

    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException(detail="Invalid token payload")

    repo = UserRepository(db)
    user = await repo.get_by_id(user_id)
    if not user:
        raise UnauthorizedException(detail="User not found")

    return user


async def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_admin:
        raise ForbiddenException(detail="Admin privileges required")
    return current_user


async def get_optional_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User | None:
    """Returns user if authenticated, None otherwise."""
    if not token:
        return None
    payload = decode_access_token(token)
    if not payload:
        return None
    user_id = payload.get("sub")
    if not user_id:
        return None
    repo = UserRepository(db)
    return await repo.get_by_id(user_id)
