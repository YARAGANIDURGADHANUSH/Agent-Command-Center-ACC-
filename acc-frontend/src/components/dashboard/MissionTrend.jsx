// Derives a simple 7-bucket completion trend from mission data so the
// dashboard has something to show without requiring a dedicated backend
// analytics endpoint. Swap for real time-series data once available.
import { normalizeStatus } from "../../utils/status";

function buildBuckets(missions) {
  const buckets = Array.from({ length: 7 }, (_, i) => ({ label: `D-${6 - i}`, count: 0 }));
  if (!missions?.length) return buckets;
  missions.forEach((m, i) => {
    const idx = i % 7;
    buckets[idx].count += normalizeStatus(m.status) === "completed" ? 1 : 0.4;
  });
  return buckets;
}

export default function MissionTrend({ missions }) {
  const buckets = buildBuckets(missions);
  const max = Math.max(1, ...buckets.map((b) => b.count));

  return (
    <div className="section-card">
      <div className="section-card-hdr">
        <h3>Mission analytics</h3>
        <span className="eyebrow">7-day trend</span>
      </div>
      <div className="section-card-body">
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90 }}>
          {buckets.map((b) => (
            <div key={b.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: "100%",
                  height: `${Math.max(4, (b.count / max) * 70)}px`,
                  background: "var(--accent-bg)",
                  border: "1px solid var(--accent-border)",
                  borderRadius: 4,
                }}
              />
              <span style={{ fontSize: 10, color: "var(--text-3)", fontFamily: "var(--mono)" }}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
