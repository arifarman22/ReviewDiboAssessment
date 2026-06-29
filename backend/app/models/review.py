import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Integer, Text, DateTime, ForeignKey, Index, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    product_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    comment: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="reviews")
    user: Mapped["User"] = relationship("User", back_populates="reviews")

    __table_args__ = (
        Index("ix_reviews_product_id", "product_id"),
        Index("ix_reviews_user_id", "user_id"),
        CheckConstraint("rating >= 1 AND rating <= 5", name="check_rating_range"),
    )

    def __repr__(self) -> str:
        return f"<Review(id={self.id}, product_id={self.product_id}, rating={self.rating})>"
