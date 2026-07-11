from fastapi import APIRouter

from app.core.config import settings
from app.services.fireworks import test_connection

router = APIRouter(
    prefix="/settings",
    tags=["Settings"],
)


@router.get("", summary="Get backend settings")
def get_settings():
    """
    Returns the current backend configuration.
    """

    return {
        "application": "Agent Command Center",
        "environment": settings.ENVIRONMENT,
        "provider": settings.AI_PROVIDER,
        "model": settings.MODEL_NAME,
        "backend_status": "Running",
    }


@router.post("", summary="Update backend settings")
def update_settings(payload: dict):
    """
    Updates runtime settings.
    (Hackathon MVP: returns success without persistence.)
    """

    return {
        "message": "Settings updated successfully.",
        "settings": payload,
    }


@router.get("/health", summary="Backend health")
def health():
    """
    Backend health check.
    """

    return {
        "status": "healthy",
        "service": "Agent Command Center Backend",
        "version": "1.0.0",
    }


@router.post("/connection/test", summary="Test AI provider connection")
def connection_test():
    """
    Tests the Fireworks AI connection.
    """

    success = test_connection()

    return {
        "provider": settings.AI_PROVIDER,
        "model": settings.MODEL_NAME,
        "connected": success,
    }