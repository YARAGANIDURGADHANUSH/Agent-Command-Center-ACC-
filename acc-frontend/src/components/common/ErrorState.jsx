import { AlertTriangle, RotateCw } from "lucide-react";

export default function ErrorState({ error, onRetry, label = "Couldn't load this" }) {
  return (
    <div className="empty-state">
      <div className="empty-icon" style={{ color: "var(--red)", background: "var(--red-bg)" }}>
        <AlertTriangle size={18} />
      </div>
      <h3>{label}</h3>
      <p>{error?.message || "The backend didn't respond. Check that it's running and reachable."}</p>
      {onRetry && (
        <div style={{ marginTop: 14 }}>
          <button className="btn sm" onClick={onRetry}>
            <RotateCw size={13} /> Retry
          </button>
        </div>
      )}
    </div>
  );
}
