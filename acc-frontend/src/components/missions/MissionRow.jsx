import { useNavigate } from "react-router-dom";
import { Square, RotateCw } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { normalizeStatus } from "../../utils/status";

export default function MissionRow({ mission, onCancel, onRetry, busy }) {
  const navigate = useNavigate();
  const status = normalizeStatus(mission.status);

  function stop(e, fn) {
    e.stopPropagation();
    fn();
  }

  return (
    <div className="list-row" onClick={() => navigate(`/missions/${mission.id}`)}>
      <div>
        <div className="list-row-name">{mission.title}</div>
        <div className="list-row-desc">{mission.objective}</div>
        <div className="list-row-meta">
          <StatusBadge status={mission.status} />
          <span className={`tag priority-${mission.priority}`}>{mission.priority} priority</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {(status === "running" || status === "queued") && onCancel && (
          <button className="btn sm danger" disabled={busy} onClick={(e) => stop(e, onCancel)}>
            <Square size={12} /> Cancel
          </button>
        )}
        {status === "failed" && onRetry && (
          <button className="btn sm" disabled={busy} onClick={(e) => stop(e, onRetry)}>
            <RotateCw size={12} /> Retry
          </button>
        )}
        <div className="list-row-arrow">→</div>
      </div>
    </div>
  );
}
