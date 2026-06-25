from datetime import datetime, timedelta, timezone
from typing import Any
from uuid import UUID, uuid4

from jose import JWTError, jwt

from app.core.config import settings


def _create_token(
    *,
    subject: UUID,
    token_type: str,
    expires_delta: timedelta,
    session_id: UUID | None = None,
) -> str:
    expire = datetime.now(timezone.utc) + expires_delta

    payload: dict[str, Any] = {
        "sub": str(subject),
        "type": token_type,
        "exp": expire,
    }

    if session_id is not None:
        payload["jti"] = str(session_id)

    return jwt.encode(
        payload,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )


def create_access_token(
    subject: UUID,
) -> str:
    return _create_token(
        subject=subject,
        token_type="access",
        expires_delta=timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
        ),
    )


def create_refresh_token(
    subject: UUID,
    session_id: UUID,
) -> str:
    return _create_token(
        subject=subject,
        token_type="refresh",
        expires_delta=timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE_DAYS,
        ),
        session_id=session_id,
    )


def create_refresh_session() -> UUID:
    return uuid4()


def decode_token(
    token: str,
) -> dict[str, Any]:
    return jwt.decode(
        token,
        settings.JWT_SECRET,
        algorithms=[settings.JWT_ALGORITHM],
    )


def verify_token(
    token: str,
    token_type: str,
) -> dict[str, Any]:
    try:
        payload = decode_token(token)

        if payload.get("type") != token_type:
            raise ValueError(
                f"Invalid token type. Expected '{token_type}'."
            )

        if payload.get("sub") is None:
            raise ValueError("Missing subject.")

        if token_type == "refresh" and payload.get("jti") is None:
            raise ValueError(
                "Missing refresh session id."
            )

        return payload

    except JWTError as exc:
        raise ValueError(
            "Invalid or expired token."
        ) from exc