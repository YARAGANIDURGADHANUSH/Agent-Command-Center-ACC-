import StatusBadge from "../common/StatusBadge";

const ICONS = {
  coordinator: "🧭",
  planner: "🗺️",
  research: "🔎",
  writer: "📝",
};

function timeAgo(iso) {
  if (!iso) return null;
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const secs = Math.round(diff / 1000);
  if (secs < 5) return "just now";
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  return `${Math.round(mins / 60)}h ago`;
}

export default function AgentCard({ agent }) {
  const updated = timeAgo(agent.last_updated);
  const iconKey = agent.name?.toLowerCase();

  return (
    <div className="card">
      <div className="flex-between" style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: "var(--bg-3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
            }}
          >
            {ICONS[iconKey] || "🤖"}
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{agent.name}</div>
          </div>
        </div>
        <StatusBadge status={agent.status} />
      </div>
      <div style={{ fontSize: 11.5, color: "var(--text-3)", marginBottom: 6 }}>
        {agent.current_task || "No active task"}
      </div>
      <div className="progress-track" style={{ marginBottom: 8 }}>
        <div className="progress-fill" style={{ width: `${agent.progress || 0}%` }} />
      </div>
      <div className="flex-between">
        <span className="text-mono" style={{ fontSize: 11, color: "var(--text-3)" }}>{agent.progress || 0}%</span>
      </div>
      {updated && (
        <div style={{ fontSize: 10.5, color: "var(--text-3)", marginTop: 8, fontFamily: "var(--mono)" }}>
          Updated {updated}
        </div>
      )}
    </div>
  );
}
