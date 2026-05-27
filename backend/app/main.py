import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.todos import router as todos_router
from app.core.config import get_settings
from app.core.logging_config import configure_logging
from app.db import Base, SessionLocal, engine
from app.models import Todo, User
from seed import TEST_USERS, database_has_users, seed_database


settings = get_settings()
configure_logging(settings.log_level)
logger = logging.getLogger(__name__)

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(todos_router)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables ensured")

    with SessionLocal() as db:
        if database_has_users(db):
            logger.info("Initial seed skipped because users already exist")
            return

        seed_database(db)
        logger.info(
            "Initial seed completed for users: %s",
            ", ".join(user["username"] for user in TEST_USERS),
        )


@app.get("/health", tags=["health"], summary="Health check")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}