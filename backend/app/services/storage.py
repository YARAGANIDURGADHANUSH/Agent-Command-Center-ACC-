"""
In-memory storage for the Agent Command Center Hackathon MVP.
Replace this module with a real database implementation after the hackathon.
"""

from datetime import datetime
from uuid import uuid4

# ------------------------------------------------------------------
# In-Memory Storage
# ------------------------------------------------------------------

MISSIONS = {}

REPORTS = {}

AGENTS = {
    "Coordinator": {
        "name": "Coordinator",
        "status": "Idle",
        "current_task": None,
        "progress": 0,
        "last_updated": None,
    },
    "Planner": {
        "name": "Planner",
        "status": "Idle",
        "current_task": None,
        "progress": 0,
        "last_updated": None,
    },
    "Research": {
        "name": "Research",
        "status": "Idle",
        "current_task": None,
        "progress": 0,
        "last_updated": None,
    },
    "Writer": {
        "name": "Writer",
        "status": "Idle",
        "current_task": None,
        "progress": 0,
        "last_updated": None,
    },
}


# ------------------------------------------------------------------
# Dashboard
# ------------------------------------------------------------------

def get_dashboard_summary():

    running = sum(
        1 for m in MISSIONS.values()
        if m["status"] == "Running"
    )

    completed = sum(
        1 for m in MISSIONS.values()
        if m["status"] == "Completed"
    )

    queued = sum(
        1 for m in MISSIONS.values()
        if m["status"] == "Queued"
    )

    failed = sum(
        1 for m in MISSIONS.values()
        if m["status"] == "Failed"
    )

    cancelled = sum(
        1 for m in MISSIONS.values()
        if m["status"] == "Cancelled"
    )

    connected_agents = sum(
        1
        for agent in AGENTS.values()
        if agent["status"] != "Offline"
    )

    return {
        "running_missions": running,
        "completed_missions": completed,
        "queued_missions": queued,
        "failed_missions": failed,
        "cancelled_missions": cancelled,
        "connected_agents": connected_agents,
        "system_health": "Healthy",
    }


# ------------------------------------------------------------------
# Missions
# ------------------------------------------------------------------

def create_mission(payload):

    mission_id = str(uuid4())

    if hasattr(payload, "model_dump"):
        data = payload.model_dump()
    else:
        data = dict(payload)

    mission = {
        "id": mission_id,
        "title": data.get("title"),
        "objective": data.get("objective"),
        "priority": data.get("priority", "Medium"),
        "status": "Queued",
        "progress": 0,
        "created_at": datetime.utcnow().isoformat(),
    }

    MISSIONS[mission_id] = mission

    return mission


def get_missions():
    return list(MISSIONS.values())


def get_mission(mission_id):
    return MISSIONS.get(mission_id)


def update_mission(
    mission_id,
    *,
    status=None,
    progress=None,
):

    mission = MISSIONS.get(mission_id)

    if mission is None:
        return None

    if status is not None:
        mission["status"] = status

    if progress is not None:
        mission["progress"] = progress

    return mission


def cancel_mission(mission_id):
    """
    Cancel only queued or running missions.
    """

    mission = MISSIONS.get(mission_id)

    if mission is None:
        return None

    status = mission["status"]

    if status == "Completed":
        raise ValueError(
            "Completed missions cannot be cancelled."
        )

    if status == "Failed":
        raise ValueError(
            "Failed missions cannot be cancelled."
        )

    if status == "Cancelled":
        raise ValueError(
            "Mission is already cancelled."
        )

    mission["status"] = "Cancelled"

    return mission


def retry_mission(mission_id):
    """
    Retry only failed missions.
    """

    mission = MISSIONS.get(mission_id)

    if mission is None:
        return None

    if mission["status"] != "Failed":
        raise ValueError(
            "Only failed missions can be retried."
        )

    mission["status"] = "Queued"
    mission["progress"] = 0

    return mission


# ------------------------------------------------------------------
# Agents
# ------------------------------------------------------------------

def get_agents():
    return list(AGENTS.values())


def get_agent(agent_name):
    return AGENTS.get(agent_name)


def update_agent(
    agent_name,
    *,
    status=None,
    current_task=None,
    progress=None,
):

    agent = AGENTS.get(agent_name)

    if agent is None:
        return None

    if status is not None:
        agent["status"] = status

    if current_task is not None:
        agent["current_task"] = current_task

    if progress is not None:
        agent["progress"] = progress

    agent["last_updated"] = datetime.utcnow().isoformat()

    return agent


# ------------------------------------------------------------------
# Reports
# ------------------------------------------------------------------

def create_report(
    mission_id,
    mission,
    summary,
    findings,
    recommendations,
):

    report_id = str(uuid4())

    report = {
        "id": report_id,
        "mission_id": mission_id,
        "mission": mission,
        "summary": summary,
        "findings": findings,
        "recommendations": recommendations,
        "generated_at": datetime.utcnow().isoformat(),
    }

    REPORTS[report_id] = report

    return report


def get_reports():
    return list(REPORTS.values())


def get_report(report_id):
    return REPORTS.get(report_id)