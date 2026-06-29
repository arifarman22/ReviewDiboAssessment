from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, Field
from app.database import get_db
from app.schemas.review import ReviewCreate, ReviewUpdate
from app.schemas.response import APIResponse
from app.services.review_service import ReviewService
from app.dependencies import get_current_user
from app.models.user import User
from app.exceptions import ForbiddenException

router = APIRouter(prefix="/reviews", tags=["Reviews"])


class ReviewCreateBody(BaseModel):
    product_id: str
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=5, max_length=2000)


@router.post(
    "",
    response_model=APIResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new review (requires authentication)",
)
async def create_review(
    data: ReviewCreateBody,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    review_data = ReviewCreate(
        product_id=data.product_id,
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


@router.get(
    "/{review_id}",
    response_model=APIResponse,
    summary="Get a specific review by ID",
)
async def get_review(review_id: str, db: AsyncSession = Depends(get_db)):
    service = ReviewService(db)
    result = await service.get_review(review_id)
    return APIResponse(
        success=True,
        message="Review retrieved",
        data=result.model_dump(),
    )


@router.put(
    "/{review_id}",
    response_model=APIResponse,
    summary="Update a review (owner only)",
)
async def update_review(
    review_id: str,
    data: ReviewUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ReviewService(db)
    # Verify ownership
    existing = await service.get_review(review_id)
    if existing.user_id != current_user.id and not current_user.is_admin:
        raise ForbiddenException(detail="You can only edit your own reviews")

    result = await service.update_review(review_id, data)
    return APIResponse(
        success=True,
        message="Review updated successfully",
        data=result.model_dump(),
    )


@router.delete(
    "/{review_id}",
    response_model=APIResponse,
    status_code=status.HTTP_200_OK,
    summary="Delete a review (owner or admin only)",
)
async def delete_review(
    review_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ReviewService(db)
    # Verify ownership
    existing = await service.get_review(review_id)
    if existing.user_id != current_user.id and not current_user.is_admin:
        raise ForbiddenException(detail="You can only delete your own reviews")

    await service.delete_review(review_id)
    return APIResponse(
        success=True,
        message="Review deleted successfully",
        data=None,
    )
