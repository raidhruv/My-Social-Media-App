from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.email_verification_token import (
    EmailVerificationToken,
)


class EmailVerificationRepository:
    def __init__(
        self,
        db: Session,
    ):
        self.db = db

    def create(
        self,
        token: EmailVerificationToken,
    ) -> EmailVerificationToken:
        self.db.add(token)
        self.db.commit()
        self.db.refresh(token)
        return token

    def get_by_user_id(
        self,
        user_id: UUID,
    ) -> EmailVerificationToken | None:
        return self.db.scalar(
            select(
                EmailVerificationToken
            ).where(
                EmailVerificationToken.user_id == user_id
            )
        )

    def get_by_token_hash(
        self,
        token_hash: str,
    ) -> EmailVerificationToken | None:
        return self.db.scalar(
            select(
                EmailVerificationToken
            ).where(
                EmailVerificationToken.token_hash == token_hash
            )
        )

    def delete(
        self,
        token: EmailVerificationToken,
    ) -> None:
        self.db.delete(token)
        self.db.commit()

    def delete_by_user_id(
        self,
        user_id: UUID,
    ) -> None:
        token = self.get_by_user_id(
            user_id,
        )

        if token:
            self.delete(
                token,
            )