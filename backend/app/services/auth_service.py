from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.refresh_session import RefreshSession
from app.models.user import User
from app.repositories.refresh_session_repository import (
    RefreshSessionRepository,
)
from app.repositories.user_repository import UserRepository
from app.schemas.auth import (
    AccessTokenResponse,
    LoginRequest,
    MessageResponse,
    RefreshTokenRequest,
    SessionResponse,
    Token,
)
from app.schemas.user import UserCreate
from app.utils.jwt import (
    create_access_token,
    create_refresh_session,
    create_refresh_token,
    verify_token,
)
from app.utils.security import (
    hash_password,
    hash_refresh_token,
    verify_password,
    verify_refresh_token,
)


class AuthService:
    def __init__(
        self,
        db: Session,
    ):
        self.db = db
        self.user_repository = UserRepository(db)
        self.refresh_repository = RefreshSessionRepository(db)

    def register(
        self,
        user_data: UserCreate,
    ) -> User:

        if self.user_repository.get_by_email(
            user_data.email,
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already exists.",
            )

        if self.user_repository.get_by_username(
            user_data.username,
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists.",
            )

        user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hash_password(
                user_data.password,
            ),
        )

        return self.user_repository.create(
            user,
        )

    def authenticate_user(
        self,
        email: str,
        password: str,
    ) -> User:

        user = self.user_repository.get_by_email(
            email,
        )

        if user is None:
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

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is disabled.",
            )

        return user

    def _create_session(
        self,
        *,
        user: User,
        refresh_token: str,
        session_id: UUID,
        device_name: str | None = None,
        user_agent: str | None = None,
        ip_address: str | None = None,
    ) -> RefreshSession:

        session = RefreshSession(
            session_id=session_id,
            user_id=user.id,
            token_hash=hash_refresh_token(
                refresh_token,
            ),
            device_name=device_name,
            user_agent=user_agent,
            ip_address=ip_address,
            expires_at=datetime.now(
                timezone.utc,
            )
            + timedelta(
                days=settings.REFRESH_TOKEN_EXPIRE_DAYS,
            ),
        )

        return self.refresh_repository.create(
            session,
        )
    
    def login(
        self,
        login_data: LoginRequest,
        device_name: str | None = None,
        user_agent: str | None = None,
        ip_address: str | None = None,
    ) -> Token:

        user = self.authenticate_user(
            email=login_data.email,
            password=login_data.password,
        )

        session_id = create_refresh_session()

        access_token = create_access_token(
            subject=user.id,
        )

        refresh_token = create_refresh_token(
            subject=user.id,
            session_id=session_id,
        )

        self._create_session(
            user=user,
            refresh_token=refresh_token,
            session_id=session_id,
            device_name=device_name,
            user_agent=user_agent,
            ip_address=ip_address,
        )

        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
        )


    def _get_valid_session(
        self,
        refresh_token: str,
    ) -> tuple[RefreshSession, User]:

        payload = verify_token(
            token=refresh_token,
            token_type="refresh",
        )

        session = self.refresh_repository.get_by_id(
            UUID(payload["jti"]),
        )

        if session is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token.",
            )

        if session.is_revoked:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh session revoked.",
            )

        if session.is_expired:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh session expired.",
            )

        if not verify_refresh_token(
            refresh_token,
            session.token_hash,
        ):
            self.refresh_repository.revoke(
                session,
            )

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token reuse detected.",
            )

        user = self.user_repository.get_by_id(
            session.user_id,
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found.",
            )

        return session, user
    
    def refresh(
        self,
        refresh_data: RefreshTokenRequest,
    ) -> Token:

        session, user = self._get_valid_session(
            refresh_data.refresh_token,
    )   

        self.refresh_repository.revoke(
            session,
        )

        new_session_id = create_refresh_session()

        access_token = create_access_token(
            subject=user.id,
        )

        refresh_token = create_refresh_token(
            subject=user.id,
            session_id=new_session_id,
        )

        self._create_session(
            user=user,
            refresh_token=refresh_token,
            session_id=new_session_id,
            device_name=session.device_name,
            user_agent=session.user_agent,
            ip_address=session.ip_address,
        )

        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
        )


    def logout(
        self,
        refresh_token: str,
    ) -> MessageResponse:

        session, _ = self._get_valid_session(
            refresh_token,
        )

        self.refresh_repository.revoke(
            session,
        )

        return MessageResponse(
            message="Logged out successfully.",
        )


    def logout_all(
        self,
        user: User,
    ) -> MessageResponse:

        self.refresh_repository.revoke_all(
            user.id,
        )

        return MessageResponse(
            message="Logged out from all devices.",
        )


    def get_sessions(
        self,
        user: User,
        current_session_id: UUID | None = None,
    ) -> list[SessionResponse]:

        sessions = self.refresh_repository.get_user_sessions(
            user.id,
        )

        result: list[SessionResponse] = []

        for session in sessions:
            result.append(
                SessionResponse(
                    id=str(session.session_id),
                    device_name=session.device_name,
                    user_agent=session.user_agent,
                    ip_address=session.ip_address,
                    created_at=session.created_at.isoformat(),
                    last_used_at=(
                        session.last_used_at.isoformat()
                        if session.last_used_at
                        else None
                    ),
                    expires_at=session.expires_at.isoformat(),
                    is_current=(
                        current_session_id
                        == session.session_id
                    ),
                )
            )

        return result