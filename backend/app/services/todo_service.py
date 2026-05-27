from datetime import date

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Todo
from app.schemas import TodoCreate, TodoUpdate


def list_todos_for_date(db: Session, owner_id: int, due_date: date) -> list[Todo]:
    statement = (
        select(Todo)
        .where(Todo.owner_id == owner_id, Todo.due_date == due_date)
        .order_by(Todo.created_at.asc(), Todo.id.asc())
    )
    return list(db.scalars(statement))


def create_todo(db: Session, owner_id: int, payload: TodoCreate) -> Todo:
    todo = Todo(
        title=payload.title.strip(),
        description=payload.description.strip() if payload.description else None,
        due_date=payload.due_date,
        completed=payload.completed,
        owner_id=owner_id,
    )
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


def update_todo(db: Session, owner_id: int, todo_id: int, payload: TodoUpdate) -> Todo:
    todo = db.get(Todo, todo_id)
    if todo is None or todo.owner_id != owner_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="TODO not found")

    todo.title = payload.title.strip()
    todo.description = payload.description.strip() if payload.description else None
    todo.due_date = payload.due_date
    todo.completed = payload.completed
    db.commit()
    db.refresh(todo)
    return todo


def delete_todo(db: Session, owner_id: int, todo_id: int) -> None:
    todo = db.get(Todo, todo_id)
    if todo is None or todo.owner_id != owner_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="TODO not found")

    db.delete(todo)
    db.commit()