import os

from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()


class Settings(BaseModel):
    # ==========================================================
    # Application
    # ==========================================================

    APP_NAME: str = "Agent Command Center"

    VERSION: str = "1.0.0"

    ENVIRONMENT: str = os.getenv(
        "ENVIRONMENT",
        "development",
    )

    # ==========================================================
    # AI Provider
    # ==========================================================

    AI_PROVIDER: str = os.getenv(
        "AI_PROVIDER",
        "Groq",
    )

    MODEL_NAME: str = os.getenv(
        "MODEL_NAME",
        "openai/gpt-oss-20b",
    )

    # ==========================================================
    # API Keys
    # ==========================================================

    GROQ_API_KEY: str = os.getenv(
        "GROQ_API_KEY",
        "",
    )

    FIREWORKS_API_KEY: str = os.getenv(
        "FIREWORKS_API_KEY",
        "",
    )


settings = Settings()