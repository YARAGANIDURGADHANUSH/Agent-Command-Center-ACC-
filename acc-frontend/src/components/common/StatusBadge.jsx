import { normalizeStatus } from "../../utils/status";

const LABELS = {
  running: "Running",
  completed: "Completed",
  idle: "Idle",
  failed: "Failed",
  queued: "Queued",
  cancelled: "Cancelled",
};

export default function StatusBadge({ status = "idle" }) {
  const normalized = normalizeStatus(status);
  const key = LABELS[normalized] ? normalized : "idle";
  return (
    <span className={`status-badge ${key}`}>
      <span className="status-dot" />
      {LABELS[key]}
    </span>
  );
}
