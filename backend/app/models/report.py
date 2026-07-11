from pydantic import BaseModel


class ReportResponse(BaseModel):
    id: str
    mission_id: str
    mission: str
    summary: str
    findings: str
    recommendations: str
    generated_at: str