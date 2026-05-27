import logging
import random
from datetime import date, timedelta

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.logging_config import configure_logging
from app.core.security import hash_password
from app.db import Base, SessionLocal, engine
from app.models import Todo, User


TEST_USERS = [
    {"username": "alice", "password": "alice123"},
    {"username": "bob", "password": "bob123"},
]
TODO_TITLES = [
    "Read FastAPI docs",
    "Write Playwright test",
    "Review SQL query",
    "Update TODO UI",
    "Practice Docker Compose",
]


def ensure_user(db, username: str, password: str) -> User:
    statement = select(User).where(User.username == username)
    user = db.scalar(statement)
    if user is None:
        user = User(username=username, hashed_password=hash_password(password))
        db.add(user)
        db.flush()
    else:
        user.hashed_password = hash_password(password)
    return user


def seed_todos(db, user: User) -> None:
    db.execute(delete(Todo).where(Todo.owner_id == user.id))
    today = date.today()
    for index in range(5):
        offset = random.randint(-2, 2)
        todo = Todo(
            title=f"{TODO_TITLES[index]} #{index + 1}",
            description="Seed data for learning and testing.",
            due_date=today + timedelta(days=offset),
            completed=random.choice([False, False, True]),
            owner_id=user.id,
        )
        db.add(todo)


def database_has_users(db: Session) -> bool:
    statement = select(User.id).limit(1)
    return db.scalar(statement) is not None


def seed_database(db: Session) -> None:
    for test_user in TEST_USERS:
        user = ensure_user(db, test_user["username"], test_user["password"])
        seed_todos(db, user)

    db.commit()


def main() -> None:
    settings = get_settings()
    configure_logging(settings.log_level)
    logger = logging.getLogger(__name__)

    Base.metadata.create_all(bind=engine)

    with SessionLocal() as db:
        seed_database(db)

    logger.info("Seed completed for users: %s", ", ".join(user["username"] for user in TEST_USERS))


if __name__ == "__main__":
    main()