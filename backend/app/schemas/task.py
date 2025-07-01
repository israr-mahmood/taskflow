from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum

class TaskPrioritySchema(str, Enum):
    LOW = 'low'
    MEDIUM = 'medium'
    HIGH = 'high'

class TaskStatusSchema(str, Enum):
    TODO = 'todo'
    IN_PROGRESS = 'in_progress'
    DONE = 'done'

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    priority: TaskPrioritySchema = TaskPrioritySchema.MEDIUM
    status: TaskStatusSchema = TaskStatusSchema.TODO
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
