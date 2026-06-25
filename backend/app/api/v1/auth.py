from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.user import UserResponse
from app.db.dependencies import get_db
from app.schemas.user import UserCreate
from app.services.auth_service import AuthService
from app.schemas.auth import (
    LoginRequest,
    RefreshTokenRequest,
    Token,
    AccessTokenResponse,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=201,
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    auth_service = AuthService(db)
    return auth_service.register(user)

@router.post(
    "/login",
    response_model=Token,
)
def login(
    credentials: LoginRequest,
    db: Session = Depends(get_db),
):
    auth_service = AuthService(db)
    return auth_service.login(credentials)

@router.post(
    "/refresh",
    response_model=AccessTokenResponse,
)
def refresh(
    refresh_token: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    auth_service = AuthService(db)
    return auth_service.refresh(refresh_token)