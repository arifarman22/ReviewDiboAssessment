from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
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


@router.get(
    "",
    response_model=APIResponse,
    summary="Get all products with search, filter, sort, and pagination",
)
async def get_products(
    search: Optional[str] = Query(None, description="Search products by title/description"),
    rating: Optional[int] = Query(None, ge=1, le=5, description="Filter by average rating"),
    sort_by: str = Query("rating", description="Sort by: rating, reviews, name, newest"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(None, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
):
    if limit is None:
        limit = settings.DEFAULT_PAGE_SIZE

    service = ProductService(db)
    result = await service.get_products(
        search=search, rating=rating, sort_by=sort_by, page=page, limit=limit
    )
    return APIResponse(
        success=True,
        message="Products retrieved successfully",
        data=result.model_dump(),
    )


@router.get(
    "/{product_id}",
    response_model=APIResponse,
    summary="Get product details with reviews and rating breakdown",
)
async def get_product_detail(product_id: str, db: AsyncSession = Depends(get_db)):
    service = ProductService(db)
    result = await service.get_product_detail(product_id)
    return APIResponse(
        success=True,
        message="Product details retrieved",
        data=result.model_dump(),
    )


@router.post(
    "",
    response_model=APIResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new product (Admin only)",
)
async def create_product(
    data: ProductCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    service = ProductService(db)
    result = await service.create_product(data)
    return APIResponse(
        success=True,
        message="Product created successfully",
        data=result.model_dump(),
    )


@router.put(
    "/{product_id}",
    response_model=APIResponse,
    summary="Update a product (Admin only)",
)
async def update_product(
    product_id: str,
    data: ProductUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    service = ProductService(db)
    result = await service.update_product(product_id, data)
    return APIResponse(
        success=True,
        message="Product updated successfully",
        data=result.model_dump(),
    )


@router.delete(
    "/{product_id}",
    response_model=APIResponse,
    summary="Delete a product (Admin only)",
)
async def delete_product(
    product_id: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    service = ProductService(db)
    await service.delete_product(product_id)
    return APIResponse(
        success=True,
        message="Product deleted successfully",
        data=None,
    )


# --- Convenience endpoint: POST /products/{id}/reviews ---

class ProductReviewCreate(BaseModel):
    """Review creation via product endpoint."""
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=5, max_length=2000)


@router.post(
    "/{product_id}/reviews",
    response_model=APIResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a review for a specific product (requires authentication)",
)
async def create_product_review(
    product_id: str,
    data: ProductReviewCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    review_data = ReviewCreate(
        product_id=product_id,
        user_id=current_user.id,
        rating=data.rating,
        comment=data.comment,
    )
    service = ReviewService(db)
    result = await service.create_review(review_data)
    return APIResponse(
        success=True,
        message="Review created successfully",
        data=result.model_dump(),
    )
