from sqlalchemy import Boolean, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import relationship
from app.models.base_model import BaseModel


class User(BaseModel):
    __tablename__ = "users"

    username: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        nullable=False,
        index=True,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    first_name: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    last_name: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    bio: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    avatar_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    avatar_public_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    banner_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    banner_public_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    location: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    website: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    refresh_sessions = relationship(
        "RefreshSession",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    email_verification_tokens = relationship(
        "EmailVerificationToken",
        back_populates="user",
        cascade="all, delete-orphan",
)