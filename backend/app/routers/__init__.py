from app.routers.auth_router import router as auth_router
from app.routers.product_router import router as product_router
from app.routers.review_router import router as review_router

__all__ = ["auth_router", "product_router", "review_router"]
