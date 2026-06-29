import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, DateTime, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    short_description: Mapped[str] = mapped_column(String(500), nullable=True)
    image_url: Mapped[str] = mapped_column(String(500), nullable=True)
    category: Mapped[str] = mapped_column(String(100), nullable=True)
    price: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    reviews: Mapped[list["Review"]] = relationship(
        "Review", back_populates="product", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Product(id={self.id}, title={self.title})>"
