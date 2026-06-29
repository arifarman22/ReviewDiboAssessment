from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel, Field
from app.database import get_db
from app.schemas.product import ProductCreate, ProductUpdate
from app.schemas.review import ReviewCreate
from app.schemas.response import APIResponse
from app.services.product_service import ProductService
from app.services.review_service import ReviewService
from app.dependencies import get_current_admin, get_current_user
from app.models.user import User
from app.config.settings import get_settings

settings = get_settings()
router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=APIResponse)
def get_products(
    search: Optional[str] = Query(None),
    rating: Optional[int] = Query(None, ge=1, le=5),
    sort_by: str = Query("rating"),
    page: int = Query(1, ge=1),
    limit: int = Query(None, ge=1, le=100),
    db: Session = Depends(get_db),
):
    if limit is None:
        limit = settings.DEFAULT_PAGE_SIZE
    service = ProductService(db)
    result = service.get_products(search=search, rating=rating, sort_by=sort_by, page=page, limit=limit)
    return APIResponse(success=True, message="Products retrieved", data=result.model_dump())


@router.get("/{product_id}", response_model=APIResponse)
def get_product_detail(product_id: str, db: Session = Depends(get_db)):
    service = ProductService(db)
    result = service.get_product_detail(product_id)
    return APIResponse(success=True, message="Product details retrieved", data=result.model_dump())


@router.post("", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
def create_product(data: ProductCreate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    service = ProductService(db)
    result = service.create_product(data)
    return APIResponse(success=True, message="Product created", data=result.model_dump())


@router.put("/{product_id}", response_model=APIResponse)
def update_product(product_id: str, data: ProductUpdate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    service = ProductService(db)
    result = service.update_product(product_id, data)
    return APIResponse(success=True, message="Product updated", data=result.model_dump())


@router.delete("/{product_id}", response_model=APIResponse)
def delete_product(product_id: str, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    service = ProductService(db)
    service.delete_product(product_id)
    return APIResponse(success=True, message="Product deleted", data=None)


class ProductReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=5, max_length=2000)


@router.post("/{product_id}/reviews", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
def create_product_review(
    product_id: str, data: ProductReviewCreate,
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user),
):
    review_data = ReviewCreate(product_id=product_id, user_id=current_user.id, rating=data.rating, comment=data.comment)
    service = ReviewService(db)
    result = service.create_review(review_data)
    return APIResponse(success=True, message="Review created", data=result.model_dump())
