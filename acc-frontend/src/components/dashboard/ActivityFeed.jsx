import EmptyState from "../common/EmptyState";
import { Activity } from "lucide-react";

const DOT_COLOR = {
  mission_started: "var(--accent)",
  mission_completed: "var(--teal)",
  mission_failed: "var(--red)",
  agent_running: "var(--accent)",
  agent_done: "var(--teal)",
};

function timeAgo(iso) {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

function renderText(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") ? <b key={i}>{part.slice(2, -2)}</b> : <span key={i}>{part}</span>
  );
}

export default function ActivityFeed({ items }) {
  return (
    <div className="section-card">
      <div className="section-card-hdr">
        <h3>Recent activity</h3>
      </div>
      <div className="section-card-body">
        {!items?.length ? (
          <EmptyState icon={<Activity size={18} />} title="No activity yet" message="Start a mission to see live updates here." />
        ) : (
          <div className="feed">
            {items.map((item) => (
              <div className="feed-item" key={item.id}>
                <span className="feed-dot" style={{ background: DOT_COLOR[item.type] || "var(--text-3)" }} />
                <div>
                  <div className="feed-text">{renderText(item.text)}</div>
                  <div className="feed-time">{timeAgo(item.time)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
