from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import Optional
from app.models.user import User


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: str) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_all(self) -> list[User]:
        return self.db.query(User).order_by(User.created_at.desc()).all()

    def create(self, user: User) -> User:
        self.db.add(user)
        self.db.flush()
        self.db.refresh(user)
        return user

    def exists(self, user_id: str) -> bool:
        return self.db.query(User.id).filter(User.id == user_id).first() is not None
