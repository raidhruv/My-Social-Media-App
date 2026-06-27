from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserUpdate


class UserService:
    def __init__(
        self,
        db: Session,
    ):
        self.db = db
        self.user_repository = UserRepository(db)

    def get_current_user_profile(
        self,
        current_user: User,
    ) -> User:
        return current_user

    def get_user_profile(
        self,
        user_id: UUID,
    ) -> User:
        user = self.user_repository.get_by_id(user_id)

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )
        
        return user
    
    def update_profile(
        self,
        current_user: User,
        user_update: UserUpdate,
    ) -> User:
        update_data = user_update.model_dump(
            exclude_unset=True,
        )

        for field, value in update_data.items():
            setattr(current_user, field, value)

        return self.user_repository.update(current_user)
