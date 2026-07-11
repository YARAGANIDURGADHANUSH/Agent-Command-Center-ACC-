from pydantic import BaseModel


class AgentResponse(BaseModel):
    name: str
    status: str
    current_task: str | None = None
    progress: int
    last_updated: str | None = None