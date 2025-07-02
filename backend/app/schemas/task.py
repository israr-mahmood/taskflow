from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum

from backend.app.models.task import TaskPriority, TaskStatus


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    priority: TaskPriority = TaskPriority.MEDIUM
    status: TaskStatus = TaskStatus.TODO
    due_date: Optional[datetime] = None
    assigned_to: Optional[int] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    priority: Optional[TaskPrioritySchema] = None
    status: Optional[TaskStatusSchema] = None
    due_date: Optional[datetime] = None
    completed: Optional[bool] = None
    assigned_to: Optional[int] = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    priority: TaskPrioritySchema
    status: TaskStatusSchema
    due_date: Optional[datetime]
    completed: bool
    project_id: int
    assigned_to: Optional[int]
    created_by: Optional[int]
    created_at: datetime
    updated_at: datetime
