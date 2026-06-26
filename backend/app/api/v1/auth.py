from fastapi import (
    APIRouter,
    Depends,
    Header,
    HTTPException,
    status,
)
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate
from app.db.dependencies import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    RefreshTokenRequest,
    Token,
    VerifyEmailRequest,
    ResendVerificationRequest,
    MessageResponse,
    SessionResponse,
)
from app.services.auth_service import AuthService


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db),
):
    service = AuthService(db)
    return service.register(user_data)


@router.post(
    "/login",
    response_model=Token,
)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db),
    user_agent: str | None = Header(default=None),
):
    service = AuthService(db)

    return service.login(
        login_data=login_data,
        user_agent=user_agent,
    )


@router.post(
    "/token",
    response_model=Token,
)
def oauth2_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
    user_agent: str | None = Header(default=None),
):
    service = AuthService(db)

    return service.login(
        login_data=LoginRequest(
            email=form_data.username,
            password=form_data.password,
        ),
        user_agent=user_agent,
    )


@router.post(
    "/refresh",
    response_model=Token,
)
def refresh(
    refresh_data: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    service = AuthService(db)

    return service.refresh(refresh_data)


@router.post(
    "/logout",
    response_model=MessageResponse,
)
def logout(
    refresh_data: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    service = AuthService(db)

    return service.logout(
        refresh_data.refresh_token,
    )


@router.post(
    "/logout-all",
    response_model=MessageResponse,
)
def logout_all(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = AuthService(db)

    return service.logout_all(
        current_user,
    )


@router.get(
    "/sessions",
    response_model=list[SessionResponse],
)
def sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = AuthService(db)

    return service.get_sessions(
        current_user,
    )

@router.post(
    "/verify-email",
    response_model=MessageResponse,
)
def verify_email(
    request: VerifyEmailRequest,
    db: Session = Depends(get_db),
):
    service = AuthService(db)
    return service.verify_email(request)


@router.post(
    "/resend-verification",
    response_model=MessageResponse,
)
def resend_verification(
    request: ResendVerificationRequest,
    db: Session = Depends(get_db),
):
    service = AuthService(db)
    return service.resend_verification(request)