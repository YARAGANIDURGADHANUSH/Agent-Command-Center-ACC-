"""
LLM Client
Supports Groq and Fireworks using the OpenAI-compatible API.
"""

from __future__ import annotations

from openai import OpenAI

from app.core.config import settings


class LLMClient:
    """LLM client wrapper."""

    def __init__(self) -> None:

        if settings.AI_PROVIDER.lower() == "groq":
            api_key = settings.GROQ_API_KEY
            base_url = "https://api.groq.com/openai/v1"

        elif settings.AI_PROVIDER.lower() == "fireworks":
            api_key = settings.FIREWORKS_API_KEY
            base_url = "https://api.fireworks.ai/inference/v1"

        else:
            raise ValueError(
                f"Unsupported AI provider: {settings.AI_PROVIDER}"
            )

        self.client = OpenAI(
            api_key=api_key,
            base_url=base_url,
        )

        self.model = settings.MODEL_NAME

    def generate_text(
        self,
        prompt: str,
        system_prompt: str = (
            "You are the AI engine powering the Agent Command Center."
        ),
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> str:

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=temperature,
            max_tokens=max_tokens,
        )

        return response.choices[0].message.content.strip()

    def generate_report(
        self,
        objective: str,
        research: str,
    ) -> str:

        prompt = f"""
Mission Objective:
{objective}

Research Output:
{research}

Generate a professional report with:

1. Executive Summary
2. Key Findings
3. Risks
4. Recommendations
5. Conclusion
"""

        return self.generate_text(prompt)

    def test_connection(self) -> bool:

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": "Reply with exactly: OK",
                    }
                ],
                max_tokens=5,
                temperature=0,
            )

            return (
                response.choices[0]
                .message.content.strip()
                .upper()
                == "OK"
            )

        except Exception:
            return False


llm_client = LLMClient()


def generate_text(prompt: str) -> str:
    return llm_client.generate_text(prompt)


def generate_report(
    objective: str,
    research: str,
) -> str:
    return llm_client.generate_report(
        objective,
        research,
    )


def test_connection() -> bool:
    return llm_client.test_connection()