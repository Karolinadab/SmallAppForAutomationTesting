import logging
from datetime import date

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import TodoCreate, TodoResponse, TodoUpdate
from app.services.todo_service import create_todo, delete_todo, list_todos_for_date, update_todo


router = APIRouter(prefix="/api/todos", tags=["todos"])
logger = logging.getLogger(__name__)


@router.get("", response_model=list[TodoResponse], summary="List TODOs for a selected date")
def get_todos(
    due_date: date = Query(..., description="Selected day in YYYY-MM-DD format"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[TodoResponse]:
    todos = list_todos_for_date(db, current_user.id, due_date)
    return [TodoResponse.model_validate(todo) for todo in todos]


@router.post("", response_model=TodoResponse, status_code=status.HTTP_201_CREATED, summary="Create a TODO")
def create_todo_endpoint(
    payload: TodoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TodoResponse:
    todo = create_todo(db, current_user.id, payload)
    logger.info("TODO created: todo_id=%s owner_id=%s", todo.id, current_user.id)
    return TodoResponse.model_validate(todo)


@router.put("/{todo_id}", response_model=TodoResponse, summary="Update a TODO")
def update_todo_endpoint(
    todo_id: int,
    payload: TodoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TodoResponse:
    todo = update_todo(db, current_user.id, todo_id, payload)
    logger.info("TODO updated: todo_id=%s owner_id=%s", todo.id, current_user.id)
    return TodoResponse.model_validate(todo)


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a TODO")
def delete_todo_endpoint(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    delete_todo(db, current_user.id, todo_id)
    logger.info("TODO deleted: todo_id=%s owner_id=%s", todo_id, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)