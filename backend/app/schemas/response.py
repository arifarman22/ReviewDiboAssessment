from pydantic import BaseModel
from typing import Any, Optional


class APIResponse(BaseModel):
    success: bool = True
    message: str = "OK"
    data: Optional[Any] = None


class PaginatedResponse(BaseModel):
    success: bool = True
    message: str = "OK"
    data: Optional[Any] = None
    total: int = 0
    page: int = 1
    limit: int = 10
