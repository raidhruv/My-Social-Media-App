from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.user import UserResponse
from app.db.dependencies import get_db
from app.schemas.auth import UserRegister
from app.services.auth_service import AuthService

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
    user: UserRegister,
    db: Session = Depends(get_db),
):
    auth_service = AuthService(db)
    return auth_service.register(user)