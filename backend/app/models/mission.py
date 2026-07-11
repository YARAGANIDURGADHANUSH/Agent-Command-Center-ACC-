from typing import Literal

from pydantic import BaseModel, Field


class MissionCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    objective: str = Field(..., min_length=10)
    priority: Literal["Low", "Medium", "High"] = "Medium"


class MissionResponse(BaseModel):
    id: str
    title: str
    objective: str
    priority: str
    status: str
    progress: int
    created_at: str