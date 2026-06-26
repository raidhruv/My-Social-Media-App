from uuid import UUID

from sqlalchemy.orm import Session

from app.models.password_reset_token import (
    PasswordResetToken,
)


class PasswordResetRepository:
    def __init__(
        self,
        db: Session,
    ):
        self.db = db

    def create(
        self,
        token: PasswordResetToken,
    ) -> PasswordResetToken:
        self.db.add(token)
        self.db.commit()
        self.db.refresh(token)
        return token

    def get_by_token_hash(
        self,
        token_hash: str,
    ) -> PasswordResetToken | None:
        return (
            self.db.query(
                PasswordResetToken,
            )
            .filter(
                PasswordResetToken.token_hash
                == token_hash,
            )
            .first()
        )

    def delete(
        self,
        token: PasswordResetToken,
    ) -> None:
        self.db.delete(token)
        self.db.commit()

    def delete_by_user_id(
        self,
        user_id: UUID,
    ) -> None:
        (
            self.db.query(
                PasswordResetToken,
            )
            .filter(
                PasswordResetToken.user_id
                == user_id,
            )
            .delete()
        )

        self.db.commit()