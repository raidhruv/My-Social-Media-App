from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID
from app.core.dependencies import get_current_active_user
from app.db.dependencies import get_db

from app.models.user import User

from app.schemas.user import (
    UserResponse,
    PublicUserResponse,
    UserUpdate,
)

from app.services.user_service import UserService

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: User = Depends(
        get_current_active_user,
    ),
    db: Session = Depends(get_db),
):
    service = UserService(db)

    return service.get_current_user_profile(
        current_user,
    )

@router.get(
    "/{user_id}",
    response_model=PublicUserResponse,
)
def get_user(
    user_id: UUID,
    db: Session = Depends(get_db),
):
    service = UserService(db)

    return service.get_user_profile(
        user_id,
    )
@router.patch(
    "/me",
    response_model=UserResponse,
)
def update_me(
    user_update: UserUpdate,
    current_user: User = Depends(
        get_current_active_user,
    ),
    db: Session = Depends(get_db),
):
    service = UserService(db)

    return service.update_profile(
        current_user=current_user,
        user_update=user_update,
    )