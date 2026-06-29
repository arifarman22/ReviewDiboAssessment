from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, examples=["John Doe"])
    email: EmailStr = Field(..., examples=["john@example.com"])


class UserCreate(UserBase):
    password: str = Field(
        ...,
        min_length=6,
        max_length=128,
        examples=["securepassword123"],
        description="Password must be 6-128 characters",
    )


class UserLogin(BaseModel):
    email: EmailStr = Field(..., examples=["john@example.com"])
    password: str = Field(..., examples=["securepassword123"])


class UserResponse(UserBase):
    id: str
    is_admin: bool = False
    created_at: datetime

    class Config:
        from_attributes = True


class UserWithToken(BaseModel):
    user: UserResponse
    access_token: str
    token_type: str = "bearer"
