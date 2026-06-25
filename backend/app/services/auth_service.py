from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from uuid import UUID
from app.models.user import User
from app.schemas.user import UserCreate
from app.utils.security import hash_password

from app.repositories.user_repository import UserRepository
from app.schemas.auth import (
    LoginRequest,
    RefreshTokenRequest,
    Token,
    AccessTokenResponse,
)
from app.utils.security import verify_password
from app.utils.jwt import (
    create_access_token,
    create_refresh_token,
    verify_token,
)


class AuthService:
    def __init__(self, db: Session):
        self.user_repository = UserRepository(db)
        
    def register(self, user_data: UserCreate) -> User:
        if self.user_repository.get_by_email(user_data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already exists.",
            )

        if self.user_repository.get_by_username(user_data.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists.",
            )

        user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hash_password(user_data.password),
        )

        return self.user_repository.create(user)
    
    def authenticate_user(
        self,
        email: str,
        password: str,
    ) -> User:
        user = self.user_repository.get_by_email(email)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        if not verify_password(
            password,
            user.hashed_password,
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        return user
    
    def login(self, login_data: LoginRequest) -> Token:
        user = self.authenticate_user(
            email=login_data.email,
            password=login_data.password,
        )

        access_token = create_access_token(user.id)

        refresh_token = create_refresh_token(user.id)

        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
        )
    def refresh(
        self,
        refresh_data: RefreshTokenRequest,
    ) -> AccessTokenResponse:

        payload = verify_token(
            refresh_data.refresh_token,
            token_type="refresh",
        )

        user = self.user_repository.get_by_id(
            UUID(payload["sub"]),
        )
        

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token.",
            )

        access_token = create_access_token(
            user.id,
        )

        return AccessTokenResponse(
            access_token=access_token,
        )