from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import Optional
from app.models.review import Review


class ReviewRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, review_id: str) -> Optional[Review]:
        result = await self.db.execute(
            select(Review).options(selectinload(Review.user)).where(Review.id == review_id)
        )
        return result.scalar_one_or_none()

    async def get_by_product_id(self, product_id: str) -> list[Review]:
        result = await self.db.execute(
            select(Review)
            .options(selectinload(Review.user))
            .where(Review.product_id == product_id)
            .order_by(Review.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_by_user_id(self, user_id: str) -> list[Review]:
        result = await self.db.execute(
            select(Review)
            .options(selectinload(Review.user))
            .where(Review.user_id == user_id)
            .order_by(Review.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_by_user_and_product(self, user_id: str, product_id: str) -> Optional[Review]:
        result = await self.db.execute(
            select(Review)
            .options(selectinload(Review.user))
            .where(Review.user_id == user_id, Review.product_id == product_id)
        )
        return result.scalar_one_or_none()

    async def create(self, review: Review) -> Review:
        self.db.add(review)
        await self.db.flush()
        await self.db.refresh(review, attribute_names=["user"])
        return review

    async def update(self, review: Review) -> Review:
        await self.db.flush()
        await self.db.refresh(review, attribute_names=["user"])
        return review

    async def delete(self, review: Review) -> None:
        await self.db.delete(review)
        await self.db.flush()

    async def get_product_stats(self, product_id: str) -> dict:
        """Get average rating and breakdown for a product."""
        result = await self.db.execute(
            select(
                func.coalesce(func.avg(Review.rating), 0),
                func.count(Review.id),
            ).where(Review.product_id == product_id)
        )
        row = result.one()
        avg_rating = round(float(row[0]), 1)
        total_reviews = int(row[1])

        # Rating breakdown
        breakdown_result = await self.db.execute(
            select(Review.rating, func.count(Review.id))
            .where(Review.product_id == product_id)
            .group_by(Review.rating)
        )
        breakdown = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        for rating, count in breakdown_result.all():
            breakdown[rating] = count

        return {
            "avg_rating": avg_rating,
            "total_reviews": total_reviews,
            "breakdown": breakdown,
        }
