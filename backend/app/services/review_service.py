from sqlalchemy.orm import Session
import re
from app.models.review import Review
from app.schemas.review import ReviewCreate, ReviewUpdate, ReviewResponse
from app.repositories.review_repository import ReviewRepository
from app.repositories.product_repository import ProductRepository
from app.repositories.user_repository import UserRepository
from app.exceptions import NotFoundException, BadRequestException


def sanitize_text(text: str) -> str:
    return re.sub(r'<[^>]+>', '', text).strip()


class ReviewService:
    def __init__(self, db: Session):
        self.review_repo = ReviewRepository(db)
        self.product_repo = ProductRepository(db)
        self.user_repo = UserRepository(db)

    def create_review(self, data: ReviewCreate) -> ReviewResponse:
        if not self.product_repo.exists(data.product_id):
            raise NotFoundException(detail="Product not found")
        if not self.user_repo.exists(data.user_id):
            raise NotFoundException(detail="User not found")

        existing = self.review_repo.get_by_user_and_product(data.user_id, data.product_id)
        if existing:
            raise BadRequestException(detail="You have already reviewed this product")

        review = Review(
            product_id=data.product_id,
            user_id=data.user_id,
            rating=data.rating,
            comment=sanitize_text(data.comment),
        )
        review = self.review_repo.create(review)

        return ReviewResponse(
            id=review.id, product_id=review.product_id, user_id=review.user_id,
            user_name=review.user.name if review.user else "",
            rating=review.rating, comment=review.comment, created_at=review.created_at,
        )

    def update_review(self, review_id: str, data: ReviewUpdate) -> ReviewResponse:
        review = self.review_repo.get_by_id(review_id)
        if not review:
            raise NotFoundException(detail="Review not found")

        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            raise BadRequestException(detail="No fields to update")

        if 'comment' in update_data:
            update_data['comment'] = sanitize_text(update_data['comment'])

        for key, value in update_data.items():
            setattr(review, key, value)

        review = self.review_repo.update(review)

        return ReviewResponse(
            id=review.id, product_id=review.product_id, user_id=review.user_id,
            user_name=review.user.name if review.user else "",
            rating=review.rating, comment=review.comment, created_at=review.created_at,
        )

    def delete_review(self, review_id: str) -> None:
        review = self.review_repo.get_by_id(review_id)
        if not review:
            raise NotFoundException(detail="Review not found")
        self.review_repo.delete(review)

    def get_review(self, review_id: str) -> ReviewResponse:
        review = self.review_repo.get_by_id(review_id)
        if not review:
            raise NotFoundException(detail="Review not found")

        return ReviewResponse(
            id=review.id, product_id=review.product_id, user_id=review.user_id,
            user_name=review.user.name if review.user else "",
            rating=review.rating, comment=review.comment, created_at=review.created_at,
        )
