import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, Boolean, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    reviews: Mapped[list["Review"]] = relationship(
        "Review", back_populates="user", cascade="all, delete-orphan"
    )

    __table_args__ = (
        Index("ix_users_email", "email"),
    )

    def __repr__(self) -> str:
        return f"<User(id={self.id}, name={self.name}, email={self.email})>"
