from fastapi import APIRouter, HTTPException

from app.models.mission import MissionCreate
from app.services.orchestrator import execute_mission
from app.services.storage import (
    create_mission,
    get_mission,
    get_missions,
    cancel_mission,
    retry_mission,
)

router = APIRouter(
    prefix="/missions",
    tags=["Missions"],
)


# ==========================================================
# Get All Missions
# ==========================================================

@router.get("", summary="Get all missions")
def list_missions():
    """
    Returns all missions.
    """
    return get_missions()


# ==========================================================
# Get Mission Details
# ==========================================================

@router.get("/{mission_id}", summary="Get mission details")
def mission_details(mission_id: str):
    """
    Returns a single mission.
    """

    mission = get_mission(mission_id)

    if mission is None:
        raise HTTPException(
            status_code=404,
            detail="Mission not found",
        )

    return mission


# ==========================================================
# Create Mission
# ==========================================================

@router.post("", summary="Create and execute mission")
def create_new_mission(payload: MissionCreate):
    """
    Creates a new mission and starts execution.
    """

    mission = create_mission(payload)

    execute_mission(mission["id"])

    return mission


# ==========================================================
# Cancel Mission
# ==========================================================

@router.post("/{mission_id}/cancel", summary="Cancel mission")
def cancel(mission_id: str):
    """
    Cancels a queued or running mission.
    """

    try:
        mission = cancel_mission(mission_id)

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    if mission is None:
        raise HTTPException(
            status_code=404,
            detail="Mission not found",
        )

    return mission


# ==========================================================
# Retry Mission
# ==========================================================

@router.post("/{mission_id}/retry", summary="Retry mission")
def retry(mission_id: str):
    """
    Retries a failed mission.
    """

    try:
        mission = retry_mission(mission_id)

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    if mission is None:
        raise HTTPException(
            status_code=404,
            detail="Mission not found",
        )

    execute_mission(mission_id)

    return mission