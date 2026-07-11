from fastapi import APIRouter, HTTPException

from app.services.storage import (
    get_agent,
    get_agents,
)

router = APIRouter(
    prefix="/agents",
    tags=["Agents"],
)


@router.get("", summary="Get all agents")
def list_agents():
    """
    Returns the current status of all AI agents.
    """

    return get_agents()


@router.get("/{agent_name}", summary="Get agent details")
def agent_details(agent_name: str):
    """
    Returns detailed information about a single agent.
    """

    agent = get_agent(agent_name)

    if agent is None:
        raise HTTPException(
            status_code=404,
            detail="Agent not found",
        )

    return agent