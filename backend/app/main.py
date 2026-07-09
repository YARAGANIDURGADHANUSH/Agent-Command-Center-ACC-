from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Agent Command Center",
    description="Multi-Agent AI Operations Platform",
    version="0.1.0",
)

# ----------------------------------
# CORS
# ----------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change later for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------
# Root Endpoint
# ----------------------------------


@app.get("/")
async def root():
    return {
        "application": "Agent Command Center",
        "version": "0.1.0",
        "status": "running",
        "message": "Welcome to ACC Backend",
    }


# ----------------------------------
# Health Check
# ----------------------------------


@app.get("/health")
async def health():
    return {"status": "healthy"}
