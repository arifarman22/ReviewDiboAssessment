from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, Tuple
from app.models.product import Product
from app.models.review import Review


class ProductRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, product_id: str) -> Optional[Product]:
        return self.db.query(Product).filter(Product.id == product_id).first()

    def get_by_id_with_reviews(self, product_id: str) -> Optional[Product]:
        product = self.db.query(Product).filter(Product.id == product_id).first()
        if product:
            # Eagerly load reviews and their users
            _ = [r.user for r in product.reviews]
        return product

    def get_all(
        self,
        search: Optional[str] = None,
        rating: Optional[int] = None,
        sort_by: str = "rating",
        page: int = 1,
        limit: int = 10,
    ) -> Tuple[list[Product], int]:
        avg_rating = func.coalesce(func.avg(Review.rating), 0).label("avg_rating")
        review_count = func.count(Review.id).label("review_count")

        query = (
            self.db.query(Product, avg_rating, review_count)
            .outerjoin(Review, Product.id == Review.product_id)
            .group_by(Product.id)
        )

        if search:
            search_term = f"%{search.lower()}%"
            query = query.filter(
                (func.lower(Product.title).like(search_term))
                | (func.lower(Product.description).like(search_term))
            )

        if rating is not None:
            query = query.having(
                func.coalesce(func.round(func.avg(Review.rating), 0), 0) == rating
            )

        # Count total
        total = query.count()

        # Sort
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

        # Paginate
        offset = (page - 1) * limit
        rows = query.offset(offset).limit(limit).all()

        products = []
        for row in rows:
            product = row[0]
            product.rating = round(float(row[1]), 1)
            product.reviews_count = int(row[2])
            products.append(product)

        return products, total

    def create(self, product: Product) -> Product:
        self.db.add(product)
        self.db.flush()
        self.db.refresh(product)
        return product

    def update(self, product: Product) -> Product:
        self.db.flush()
        self.db.refresh(product)
        return product

    def delete(self, product: Product) -> None:
        self.db.delete(product)
        self.db.flush()

    def exists(self, product_id: str) -> bool:
        return self.db.query(Product.id).filter(Product.id == product_id).first() is not None
