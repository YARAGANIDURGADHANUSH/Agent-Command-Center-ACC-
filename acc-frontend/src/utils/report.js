/**
 * utils/report.js
 * Helpers matching the current FastAPI backend response.
 *
 * Backend report:
 * {
 *   id,
 *   mission_id,
 *   mission,
 *   summary,
 *   findings,
 *   recommendations,
 *   generated_at
 * }
 */

export function getReportId(report) {
  return report?.id;
}

export function getMissionId(report) {
  return report?.mission_id;
}

export function getReportTitle(report) {
  if (!report) return "Report";

  if (report.mission) {
    return `Report — ${report.mission}`;
  }

  return "Report";
}