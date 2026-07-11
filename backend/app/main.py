from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.dashboard import router as dashboard_router
from app.api.missions import router as missions_router
from app.api.agents import router as agents_router
from app.api.reports import router as reports_router
from app.api.settings import router as settings_router

from app.core.config import settings

# ==========================================================
# FastAPI Application
# ==========================================================

app = FastAPI(
    title=settings.APP_NAME,
    description="Multi-Agent AI Operations Platform",
    version=settings.VERSION,
)

# ==========================================================
# CORS
# ==========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# Register API Routers
# ==========================================================

app.include_router(dashboard_router, prefix="/api")
app.include_router(missions_router, prefix="/api")
app.include_router(agents_router, prefix="/api")
app.include_router(reports_router, prefix="/api")
app.include_router(settings_router, prefix="/api")

# ==========================================================
# Root Endpoint
# ==========================================================

@app.get("/", tags=["System"])
async def root():
    return {
        "application": settings.APP_NAME,
        "version": settings.VERSION,
        "status": "running",
        "environment": settings.ENVIRONMENT,
        "ai_provider": settings.AI_PROVIDER,
        "message": "Welcome to Agent Command Center Backend",
    }

# ==========================================================
# Health Check
# ==========================================================

@app.get("/health", tags=["System"])
async def health():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.VERSION,
    }