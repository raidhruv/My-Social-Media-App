from uuid import UUID
from fastapi import UploadFile
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserUpdate
from app.services.media_service import MediaService


class UserService:
    def __init__(
        self,
        db: Session,
    ):
        self.db = db
        self.user_repository = UserRepository(db)
        self.media_service = MediaService()

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
    
    def upload_avatar(
        self,
        current_user: User,
        file: UploadFile,
    ) -> User:

        if current_user.avatar_public_id:
            self.media_service.delete_avatar(
                current_user.avatar_public_id,
            )

        avatar_url, avatar_public_id = self.media_service.upload_avatar(
            file=file,
        )

        current_user.avatar_url = avatar_url
        current_user.avatar_public_id = avatar_public_id

        return self.user_repository.update(
            current_user,
        )
    
    def delete_avatar(
        self,
        current_user: User,
    ) -> User:

        if current_user.avatar_public_id:
            self.media_service.delete_avatar(
                current_user.avatar_public_id,
        )   

        current_user.avatar_url = None
        current_user.avatar_public_id = None

        return self.user_repository.update(
            current_user,
        )
    
    def upload_banner(
        self,
        current_user: User,
        file: UploadFile,
    ) -> User:

        if current_user.banner_public_id:
            self.media_service.delete_banner(
                current_user.banner_public_id,
            )

        banner_url, banner_public_id = self.media_service.upload_banner(
            file=file,
        )

        current_user.banner_url = banner_url
        current_user.banner_public_id = banner_public_id

        return self.user_repository.update(
            current_user,
        )
    
    def delete_banner(
        self,
        current_user: User,
    ) -> User:

        if current_user.banner_public_id:
            self.media_service.delete_banner(
                current_user.banner_public_id,
            )

        current_user.banner_url = None
        current_user.banner_public_id = None

        return self.user_repository.update(
            current_user,
        )
