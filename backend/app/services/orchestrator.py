"""
Mission Orchestrator
Coordinates the multi-agent workflow for the Agent Command Center.
"""

from app.services.fireworks import generate_text

from app.services.report_formatter import format_report

from app.services.storage import (
    create_report,
    get_mission,
    update_agent,
    update_mission,
)


def execute_mission(mission_id: str):
    """
    Executes the complete mission workflow.
    """

    mission = get_mission(mission_id)

    if mission is None:
        return

    objective = mission["objective"]

    try:

        # ------------------------------------------------------
        # Mission Started
        # ------------------------------------------------------

        update_mission(
            mission_id,
            status="Running",
            progress=5,
        )

        # ------------------------------------------------------
        # Coordinator
        # ------------------------------------------------------

        update_agent(
            "Coordinator",
            status="Running",
            current_task="Coordinating mission",
            progress=10,
        )

        # ------------------------------------------------------
        # Planner
        # ------------------------------------------------------

        update_agent(
            "Planner",
            status="Running",
            current_task="Planning mission",
            progress=25,
        )

        plan = planner(objective)

        update_mission(
            mission_id,
            progress=30,
        )

        update_agent(
            "Planner",
            status="Completed",
            current_task=None,
            progress=100,
        )

        # ------------------------------------------------------
        # Research
        # ------------------------------------------------------

        update_agent(
            "Research",
            status="Running",
            current_task="Collecting information",
            progress=50,
        )

        research = researcher(plan)

        update_mission(
            mission_id,
            progress=70,
        )

        update_agent(
            "Research",
            status="Completed",
            current_task=None,
            progress=100,
        )

        # ------------------------------------------------------
        # Writer
        # ------------------------------------------------------

        update_agent(
            "Writer",
            status="Running",
            current_task="Generating report",
            progress=80,
        )

        raw_report = writer(
            objective,
            research,
        )

        # ------------------------------------------------------
        # Report Formatter
        # ------------------------------------------------------

        formatted_report = format_report(
            mission=mission["title"],
            raw_report=raw_report,
        )

        # ------------------------------------------------------
        # Store Report
        # ------------------------------------------------------

        create_report(
            mission_id=mission_id,
            mission=mission["title"],
            summary=formatted_report,
            findings=research,
            recommendations=(
                "Review findings and execute the "
                "recommended remediation actions."
            ),
        )

        # ------------------------------------------------------
        # Mission Complete
        # ------------------------------------------------------

        update_mission(
            mission_id,
            progress=100,
            status="Completed",
        )

        update_agent(
            "Writer",
            status="Completed",
            current_task=None,
            progress=100,
        )

        update_agent(
            "Coordinator",
            status="Idle",
            current_task=None,
            progress=100,
        )

        print("\n" + "=" * 80)
        print("MISSION COMPLETED")
        print("Mission:", mission["title"])
        print("=" * 80 + "\n")

    except Exception as e:

        print("\n" + "=" * 80)
        print("MISSION FAILED")
        print("Mission:", mission["title"])
        print("Exception Type:", type(e).__name__)
        print("Exception:", str(e))
        print("=" * 80 + "\n")

        import traceback

        traceback.print_exc()

        update_mission(
            mission_id,
            status="Failed",
        )

        for agent in [
            "Coordinator",
            "Planner",
            "Research",
            "Writer",
        ]:
            update_agent(
                agent,
                status="Idle",
                current_task=None,
                progress=0,
            )


# ==========================================================
# Individual AI Agents
# ==========================================================

def planner(objective: str) -> str:
    """
    Planner Agent
    Creates the execution strategy.
    """

    prompt = f"""
You are the Planner Agent.

Mission Objective:
{objective}

Your ONLY job is to break this objective down into a clear, concise
execution plan: the tasks required and the research approach to take.

Do NOT perform research.
Do NOT write report content.
Do NOT generate findings, recommendations, or conclusions.

Return the execution plan as concise steps.
"""

    return generate_text(prompt)


def researcher(plan: str) -> str:
    """
    Research Agent
    Performs research based on the execution plan.
    """

    prompt = f"""
You are the Research Agent.

Execution Plan:
{plan}

Your ONLY job is to produce a research dataset for this plan: technical
analysis, facts, evidence, comparisons, statistics, references, tables,
and risk analysis.

Do NOT write an Executive Summary.
Do NOT write Recommendations.
Do NOT write a Conclusion.
Do NOT write a Mission Report or Final Report.

Return the research as structured findings.
"""

    return generate_text(prompt)


def writer(
    objective: str,
    research: str,
) -> str:
    """
    Writer Agent
    Produces the narrative report content.
    """

    prompt = f"""
You are the Writer Agent.

Mission Objective:
{objective}

Research Dataset:
{research}

Your ONLY job is to write the narrative report content using exactly
these Markdown sections, in this exact order:

# Executive Summary
# Key Findings
# Risk Assessment
# Recommendations
# Conclusion

Do NOT include a "Mission Report" title, mission metadata, generated
time, generated by, separators, headers, footers, page layout, or any
other presentation formatting.
Do NOT wrap your output in another report.

Return only the content of the five sections above.
"""

    return generate_text(prompt)