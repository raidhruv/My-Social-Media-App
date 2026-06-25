from datetime import datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.refresh_session import RefreshSession


class RefreshSessionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        session: RefreshSession,
    ) -> RefreshSession:
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session

    def get_by_id(
        self,
        session_id: UUID,
    ) -> RefreshSession | None:
        return self.db.scalar(
            select(RefreshSession).where(
                RefreshSession.session_id == session_id,
            )
        )

    def get_user_sessions(
        self,
        user_id: UUID,
    ) -> list[RefreshSession]:
        return list(
            self.db.scalars(
                select(RefreshSession)
                .where(
                    RefreshSession.user_id == user_id,
                )
                .order_by(
                    RefreshSession.created_at.desc(),
                )
            )
        )

    def update(
        self,
        session: RefreshSession,
    ) -> RefreshSession:
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session

    def revoke(
        self,
        session: RefreshSession,
    ) -> RefreshSession:
        session.revoked_at = datetime.utcnow()

        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)

        return session

    def revoke_all(
        self,
        user_id: UUID,
    ) -> None:
        sessions = self.get_user_sessions(user_id)

        now = datetime.utcnow()

        for session in sessions:
            session.revoked_at = now

        self.db.commit()

    def delete(
        self,
        session: RefreshSession,
    ) -> None:
        self.db.delete(session)
        self.db.commit()