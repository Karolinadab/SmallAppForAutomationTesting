from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    created_at: datetime


class TodoBase(BaseModel):
    title: str = Field(min_length=1, max_length=120, examples=["Buy milk"])
    description: str | None = Field(default=None, max_length=500)
    due_date: date


class TodoCreate(TodoBase):
    completed: bool = False


class TodoUpdate(TodoBase):
    completed: bool


class TodoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    due_date: date
    completed: bool
    owner_id: int
    created_at: datetime
    updated_at: datetime | None