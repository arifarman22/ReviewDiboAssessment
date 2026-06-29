from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Dict


class ProductBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, examples=["Wireless Mouse"])
    description: str = Field(..., min_length=1, examples=["A premium wireless mouse"])
    short_description: Optional[str] = Field(None, max_length=500)
    image_url: Optional[str] = Field(None, max_length=500)
    category: Optional[str] = Field(None, max_length=100)
    price: float = Field(default=0.0, ge=0)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, min_length=1)
    short_description: Optional[str] = Field(None, max_length=500)
    image_url: Optional[str] = Field(None, max_length=500)
    category: Optional[str] = Field(None, max_length=100)
    price: Optional[float] = Field(None, ge=0)


class ProductResponse(ProductBase):
    id: str
    created_at: datetime
    rating: float = 0.0
    reviews_count: int = 0

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    products: List[ProductResponse]
    total: int
    page: int
    limit: int


class ReviewInProduct(BaseModel):
    id: str
    user_id: str
    user_name: str
    rating: int
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True


class ProductDetailResponse(ProductBase):
    id: str
    created_at: datetime
    rating: float = 0.0
    reviews_count: int = 0
    reviews: List[ReviewInProduct] = []
    breakdown: Dict[int, int] = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}

    class Config:
        from_attributes = True
