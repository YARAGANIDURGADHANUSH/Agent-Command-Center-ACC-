from fastapi import APIRouter

from app.services.storage import get_dashboard_summary

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("", summary="Get dashboard summary")
def get_dashboard():
    """
    Returns the current dashboard metrics.
    """

    return get_dashboard_summary()


@router.get("/health", summary="Backend health check")
def health_check():
    """
    Simple health endpoint for frontend connectivity.
    """

    return {
        "status": "healthy",
        "service": "Agent Command Center Backend",
        "version": "1.0.0",
    }