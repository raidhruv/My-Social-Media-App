from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.db.database import engine


def test_connection() -> None:
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version();"))
            print("\n✅ Database connected successfully!\n")
            print(result.scalar())
    except SQLAlchemyError as e:
        print("\n❌ Database connection failed!\n")
        print(e)


if __name__ == "__main__":
    test_connection()