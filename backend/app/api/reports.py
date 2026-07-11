from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse

from app.services.storage import (
    get_report,
    get_reports,
)

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.get("", summary="Get all reports")
def list_reports():
    """
    Returns all generated reports.
    """

    return get_reports()


@router.get("/{report_id}", summary="Get report details")
def report_details(report_id: str):
    """
    Returns a single report.
    """

    report = get_report(report_id)

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Report not found",
        )

    return report


@router.get(
    "/{report_id}/download",
    summary="Download report",
    response_class=PlainTextResponse,
)
def download_report(report_id: str):
    """
    Downloads the report as Markdown.
    """

    report = get_report(report_id)

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Report not found",
        )

    markdown = f"""# Mission Report

## Mission
{report["mission"]}

## Summary
{report["summary"]}

## Findings
{report["findings"]}

## Recommendations
{report["recommendations"]}
"""

    return markdown