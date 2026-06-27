from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr


class UserBase(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    bio: str | None = None
    avatar_url: str | None = None
    banner_url: str | None = None
    location: str | None = None
    website: str | None = None


class UserCreate(UserBase):
    username: str
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: UUID
    username: str
    email: EmailStr
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class PublicUserResponse(UserBase):
    id: UUID
    username: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    bio: str | None = None
    location: str | None = None
    website: str | None = None        