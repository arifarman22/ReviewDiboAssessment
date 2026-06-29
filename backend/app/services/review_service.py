from sqlalchemy.ext.asyncio import AsyncSession
import re
from app.models.review import Review
from app.schemas.review import ReviewCreate, ReviewUpdate, ReviewResponse
from app.repositories.review_repository import ReviewRepository
from app.repositories.product_repository import ProductRepository
from app.repositories.user_repository import UserRepository
from app.exceptions import NotFoundException, BadRequestException


def sanitize_text(text: str) -> str:
    """Strip HTML tags to prevent XSS."""
    return re.sub(r'<[^>]+>', '', text).strip()


class ReviewService:
    def __init__(self, db: AsyncSession):
        self.review_repo = ReviewRepository(db)
        self.product_repo = ProductRepository(db)
        self.user_repo = UserRepository(db)

    async def create_review(self, data: ReviewCreate) -> ReviewResponse:
        # Validate product exists
        if not await self.product_repo.exists(data.product_id):
            raise NotFoundException(detail=f"Product with id '{data.product_id}' not found")

        # Validate user exists
        if not await self.user_repo.exists(data.user_id):
            raise NotFoundException(detail=f"User with id '{data.user_id}' not found")

        # Check if user already reviewed this product
        existing = await self.review_repo.get_by_user_and_product(data.user_id, data.product_id)
        if existing:
            raise BadRequestException(detail="You have already reviewed this product. You can edit your existing review instead.")

        review = Review(
            product_id=data.product_id,
            user_id=data.user_id,
            rating=data.rating,
            comment=sanitize_text(data.comment),
        )
        review = await self.review_repo.create(review)

        return ReviewResponse(
            id=review.id,
            product_id=review.product_id,
            user_id=review.user_id,
            user_name=review.user.name if review.user else "",
            rating=review.rating,
            comment=review.comment,
            created_at=review.created_at,
        )

    async def update_review(self, review_id: str, data: ReviewUpdate) -> ReviewResponse:
        review = await self.review_repo.get_by_id(review_id)
        if not review:
            raise NotFoundException(detail=f"Review with id '{review_id}' not found")

        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            raise BadRequestException(detail="No fields to update")

        # Sanitize comment if being updated
        if 'comment' in update_data:
            update_data['comment'] = sanitize_text(update_data['comment'])

        for key, value in update_data.items():
            setattr(review, key, value)

        review = await self.review_repo.update(review)

        return ReviewResponse(
            id=review.id,
            product_id=review.product_id,
            user_id=review.user_id,
            user_name=review.user.name if review.user else "",
            rating=review.rating,
            comment=review.comment,
            created_at=review.created_at,
        )

    async def delete_review(self, review_id: str) -> None:
        review = await self.review_repo.get_by_id(review_id)
        if not review:
            raise NotFoundException(detail=f"Review with id '{review_id}' not found")
        await self.review_repo.delete(review)

    async def get_review(self, review_id: str) -> ReviewResponse:
        review = await self.review_repo.get_by_id(review_id)
        if not review:
            raise NotFoundException(detail=f"Review with id '{review_id}' not found")

        return ReviewResponse(
            id=review.id,
            product_id=review.product_id,
            user_id=review.user_id,
            user_name=review.user.name if review.user else "",
            rating=review.rating,
            comment=review.comment,
            created_at=review.created_at,
        )
