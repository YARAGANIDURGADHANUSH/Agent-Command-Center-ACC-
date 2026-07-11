/**
 * utils/status.js
 * ─────────────────────────────────────────────────────────────────────────
 * The backend returns mission (and agent) status as capitalized strings —
 * "Queued", "Running", "Completed", "Failed", "Cancelled" — while the UI's
 * CSS classes, filter keys, and StatusBadge labels are lowercase. Every
 * comparison against a status value should go through this helper so the
 * frontend works regardless of the exact casing the backend sends.
 */
export function normalizeStatus(status) {
  return typeof status === "string" ? status.toLowerCase() : status;
}
