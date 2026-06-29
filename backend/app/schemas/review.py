from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class ReviewBase(BaseModel):
    rating: int = Field(..., ge=1, le=5, examples=[5])
    comment: str = Field(..., min_length=5, max_length=2000, examples=["Great product!"])


class ReviewCreate(ReviewBase):
    product_id: str = Field(..., examples=["product-uuid-here"])
    user_id: str = Field(..., examples=["user-uuid-here"])


class ReviewCreateAuth(ReviewBase):
    """Used when user is authenticated - user_id comes from token."""
    product_id: str = Field(..., examples=["product-uuid-here"])


class ReviewUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
    comment: Optional[str] = Field(None, min_length=5, max_length=2000)


class ReviewResponse(ReviewBase):
    id: str
    product_id: str
    user_id: str
    user_name: str = ""
    created_at: datetime

    class Config:
        from_attributes = True
