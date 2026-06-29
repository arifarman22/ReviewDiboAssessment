from sqlalchemy.orm import Session
from typing import Optional
from app.models.product import Product
from app.schemas.product import (
    ProductCreate, ProductUpdate, ProductResponse,
    ProductListResponse, ProductDetailResponse, ReviewInProduct,
)
from app.repositories.product_repository import ProductRepository
from app.repositories.review_repository import ReviewRepository
from app.exceptions import NotFoundException


class ProductService:
    def __init__(self, db: Session):
        self.product_repo = ProductRepository(db)
        self.review_repo = ReviewRepository(db)

    def get_products(self, search=None, rating=None, sort_by="rating", page=1, limit=10) -> ProductListResponse:
        products, total = self.product_repo.get_all(
            search=search, rating=rating, sort_by=sort_by, page=page, limit=limit
        )

        product_responses = []
        for p in products:
            product_responses.append(ProductResponse(
                id=p.id, title=p.title, description=p.description,
                short_description=p.short_description, image_url=p.image_url,
                category=p.category, price=p.price, created_at=p.created_at,
                rating=getattr(p, "rating", 0.0),
                reviews_count=getattr(p, "reviews_count", 0),
            ))

        return ProductListResponse(products=product_responses, total=total, page=page, limit=limit)

    def get_product_detail(self, product_id: str) -> ProductDetailResponse:
        product = self.product_repo.get_by_id_with_reviews(product_id)
        if not product:
            raise NotFoundException(detail=f"Product not found")

        stats = self.review_repo.get_product_stats(product_id)

        reviews = []
        for r in product.reviews:
            reviews.append(ReviewInProduct(
                id=r.id, user_id=r.user_id,
                user_name=r.user.name if r.user else "Anonymous",
                rating=r.rating, comment=r.comment, created_at=r.created_at,
            ))
        reviews.sort(key=lambda x: x.created_at, reverse=True)

        return ProductDetailResponse(
            id=product.id, title=product.title, description=product.description,
            short_description=product.short_description, image_url=product.image_url,
            category=product.category, price=product.price, created_at=product.created_at,
            rating=stats["avg_rating"], reviews_count=stats["total_reviews"],
            reviews=reviews, breakdown=stats["breakdown"],
        )

    def create_product(self, data: ProductCreate) -> ProductResponse:
        product = Product(
            title=data.title, description=data.description,
            short_description=data.short_description, image_url=data.image_url,
            category=data.category, price=data.price,
        )
        product = self.product_repo.create(product)
        return ProductResponse(
            id=product.id, title=product.title, description=product.description,
            short_description=product.short_description, image_url=product.image_url,
            category=product.category, price=product.price, created_at=product.created_at,
            rating=0.0, reviews_count=0,
        )

    def update_product(self, product_id: str, data: ProductUpdate) -> ProductResponse:
        product = self.product_repo.get_by_id(product_id)
        if not product:
            raise NotFoundException(detail="Product not found")

        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(product, key, value)

        product = self.product_repo.update(product)
        stats = self.review_repo.get_product_stats(product_id)

        return ProductResponse(
            id=product.id, title=product.title, description=product.description,
            short_description=product.short_description, image_url=product.image_url,
            category=product.category, price=product.price, created_at=product.created_at,
            rating=stats["avg_rating"], reviews_count=stats["total_reviews"],
        )

    def delete_product(self, product_id: str) -> None:
        product = self.product_repo.get_by_id(product_id)
        if not product:
            raise NotFoundException(detail="Product not found")
        self.product_repo.delete(product)
