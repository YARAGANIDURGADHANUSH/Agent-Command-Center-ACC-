/**
 * api/client.js
 * ─────────────────────────────────────────────────────────────────────────
 * The ONE file that connects the ACC frontend to the ACC backend. Every
 * network call in the app goes through here — components never call
 * fetch() directly. There is no mock/demo data anywhere in this file or
 * downstream of it: if the backend is unreachable, calls throw ApiError
 * and pages render a real error state with a retry action.
 *
 * Backend contract (FastAPI, all routes prefixed with /api):
 *   GET    /api/dashboard
 *   GET    /api/dashboard/health
 *
 *   GET    /api/missions
 *   GET    /api/missions/{mission_id}
 *   POST   /api/missions
 *   POST   /api/missions/{mission_id}/cancel
 *   POST   /api/missions/{mission_id}/retry
 *
 *   GET    /api/agents
 *   GET    /api/agents/{agent_name}
 *
 *   GET    /api/reports
 *   GET    /api/reports/{report_id}
 *   GET    /api/reports/{report_id}/download
 *
 *   GET    /api/settings
 *   POST   /api/settings
 *   GET    /api/settings/health
 *   POST   /api/settings/connection/test
 *
 * There is no dedicated "activities" endpoint and no generic "/health"
 * endpoint — the Recent Activity feed is derived client-side from mission
 * and report data, and backend reachability is probed via
 * GET /api/dashboard/health.
 *
 * Configure the backend location via .env:
 *   VITE_API_BASE_URL=http://localhost:8000
 * ─────────────────────────────────────────────────────────────────────────
 */

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const API_PREFIX = "/api";

export class ApiError extends Error {
  constructor(message, status, endpoint) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.endpoint = endpoint;
  }
}

let backendReachable = null; // null = unknown, true/false once probed
const listeners = new Set();

function setReachable(value) {
  if (backendReachable !== value) {
    backendReachable = value;
    listeners.forEach((fn) => fn(value));
  }
}

/** Subscribe to connection status changes. Returns an unsubscribe fn. */
export function onConnectionChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getConnectionStatus() {
  return backendReachable;
}

/**
 * Core request helper. Every endpoint function below funnels through this.
 * All backend routes live under /api, so `path` should be given relative
 * to that prefix (e.g. "/missions", not "/api/missions").
 * Always throws ApiError on failure — no silent fallback data.
 */
async function request(path, { method = "GET", body, signal, raw = false } = {}) {
  const url = `${BASE_URL}${API_PREFIX}${path}`;
  let res;
  try {
    res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    setReachable(false);
    throw new ApiError(err.message || "Network error — is the backend running?", 0, path);
  }

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const errJson = await res.json();
      detail = errJson.detail || errJson.message || detail;
    } catch {
      /* body wasn't JSON, ignore */
    }
    // A reachable-but-erroring backend still counts as "reachable" for the
    // connection indicator — only network-level failure means unreachable.
    setReachable(true);
    throw new ApiError(detail, res.status, path);
  }

  setReachable(true);
  if (raw) return res;
  if (res.status === 204) return null;
  return await res.json();
}

/* ── Dashboard ───────────────────────────────────────────────────────── */

export const dashboardApi = {
  summary: () => request("/dashboard"),
  health: () => request("/dashboard/health"),
};

/**
 * Probe the backend once on app start (and periodically thereafter) so the
 * UI can show connection state. There's no generic /health endpoint on
 * this backend, so we reuse GET /api/dashboard/health as the reachability
 * check.
 */
export async function probeBackend() {
  try {
    await dashboardApi.health();
  } catch {
    /* setReachable(false) already called inside request() */
  }
  return backendReachable;
}

/* ── Missions ────────────────────────────────────────────────────────── */

export const missionsApi = {
  list: () => request("/missions"),
  get: (id) => request(`/missions/${id}`),
  create: (mission) => request("/missions", { method: "POST", body: mission }),
  cancel: (id) => request(`/missions/${id}/cancel`, { method: "POST" }),
  retry: (id) => request(`/missions/${id}/retry`, { method: "POST" }),
};

/* ── Agents ──────────────────────────────────────────────────────────── */

export const agentsApi = {
  list: () => request("/agents"),
  get: (name) => request(`/agents/${name}`),
};

/* ── Reports ─────────────────────────────────────────────────────────── */

export const reportsApi = {
  list: () => request("/reports"),
  get: (id) => request(`/reports/${id}`),
  /** Downloads the report file and returns { blob, filename }. */
  download: async (id) => {
    const res = await request(`/reports/${id}/download`, { raw: true });
    const blob = await res.blob();
    const disposition = res.headers.get("Content-Disposition") || "";
    const match = disposition.match(/filename="?([^"]+)"?/);
    const filename = match ? match[1] : `report-${id}`;
    return { blob, filename };
  },
};

/* ── Settings ────────────────────────────────────────────────────────── */

export const settingsApi = {
  get: () => request("/settings"),
  save: (settings) => request("/settings", { method: "POST", body: settings }),
  health: () => request("/settings/health"),
  testConnection: (payload) => request("/settings/connection/test", { method: "POST", body: payload }),
};
