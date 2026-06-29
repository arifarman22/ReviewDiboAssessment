from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, case
from sqlalchemy.orm import selectinload
from typing import Optional, Tuple
from app.models.product import Product
from app.models.review import Review


class ProductRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, product_id: str) -> Optional[Product]:
        result = await self.db.execute(
            select(Product).where(Product.id == product_id)
        )
        return result.scalar_one_or_none()

    async def get_by_id_with_reviews(self, product_id: str) -> Optional[Product]:
        result = await self.db.execute(
            select(Product)
            .options(selectinload(Product.reviews).selectinload(Review.user))
            .where(Product.id == product_id)
        )
        return result.scalar_one_or_none()

    async def get_all(
        self,
        search: Optional[str] = None,
        rating: Optional[int] = None,
        sort_by: str = "rating",
        page: int = 1,
        limit: int = 10,
    ) -> Tuple[list[Product], int]:
        # Base query with review stats
        avg_rating = func.coalesce(func.avg(Review.rating), 0).label("avg_rating")
        review_count = func.count(Review.id).label("review_count")

        query = (
            select(Product, avg_rating, review_count)
            .outerjoin(Review, Product.id == Review.product_id)
            .group_by(Product.id)
        )

        # Search filter
        if search:
            search_term = f"%{search.lower()}%"
            query = query.where(
                (func.lower(Product.title).like(search_term))
                | (func.lower(Product.description).like(search_term))
                | (func.lower(Product.short_description).like(search_term))
            )

        # Rating filter
        if rating is not None:
            query = query.having(
                func.coalesce(func.round(func.avg(Review.rating)), 0) == rating
            )

        # Count total before pagination
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar() or 0

        # Sorting
        if sort_by == "rating":
            query = query.order_by(avg_rating.desc())
        elif sort_by == "reviews":
            query = query.order_by(review_count.desc())
        elif sort_by == "name":
            query = query.order_by(Product.title.asc())
        elif sort_by == "newest":
            query = query.order_by(Product.created_at.desc())
        else:
            query = query.order_by(avg_rating.desc())

        # Pagination
        offset = (page - 1) * limit
        query = query.offset(offset).limit(limit)

        result = await self.db.execute(query)
        rows = result.all()

        products = []
        for row in rows:
            product = row[0]
            product.rating = round(float(row[1]), 1)
            product.reviews_count = int(row[2])
            products.append(product)

        return products, total

    async def create(self, product: Product) -> Product:
        self.db.add(product)
        await self.db.flush()
        await self.db.refresh(product)
        return product

    async def update(self, product: Product) -> Product:
        await self.db.flush()
        await self.db.refresh(product)
        return product

    async def delete(self, product: Product) -> None:
        await self.db.delete(product)
        await self.db.flush()

    async def exists(self, product_id: str) -> bool:
        result = await self.db.execute(
            select(Product.id).where(Product.id == product_id)
        )
        return result.scalar_one_or_none() is not None
