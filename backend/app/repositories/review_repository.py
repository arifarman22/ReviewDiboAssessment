from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from app.models.review import Review


class ReviewRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, review_id: str) -> Optional[Review]:
        review = self.db.query(Review).filter(Review.id == review_id).first()
        if review:
            _ = review.user  # Load user
        return review

    def get_by_user_and_product(self, user_id: str, product_id: str) -> Optional[Review]:
        return (
            self.db.query(Review)
            .filter(Review.user_id == user_id, Review.product_id == product_id)
            .first()
        )

    def create(self, review: Review) -> Review:
        self.db.add(review)
        self.db.flush()
        self.db.refresh(review)
        _ = review.user  # Load user relationship
        return review

    def update(self, review: Review) -> Review:
        self.db.flush()
        self.db.refresh(review)
        _ = review.user
        return review

    def delete(self, review: Review) -> None:
        self.db.delete(review)
        self.db.flush()

    def get_product_stats(self, product_id: str) -> dict:
        result = self.db.query(
            func.coalesce(func.avg(Review.rating), 0),
            func.count(Review.id),
        ).filter(Review.product_id == product_id).first()

        avg_rating = round(float(result[0]), 1)
        total_reviews = int(result[1])

        breakdown_result = (
            self.db.query(Review.rating, func.count(Review.id))
            .filter(Review.product_id == product_id)
            .group_by(Review.rating)
            .all()
        )
        breakdown = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        for rating, count in breakdown_result:
            breakdown[rating] = count

        return {
            "avg_rating": avg_rating,
            "total_reviews": total_reviews,
            "breakdown": breakdown,
        }
