// The backend's dashboard response includes a single `system_health` field.
// Its exact shape isn't part of the documented contract, so this renders
// whatever comes back without assuming invented sub-services: a string
// status is shown as one row, an object is shown as one row per key it
// actually contains.
function normalize(health) {
  if (health == null) return [];
  if (typeof health === "string") return [{ key: "system_health", label: "System", status: health }];
  if (typeof health === "object") {
    return Object.entries(health).map(([key, status]) => ({
      key,
      label: key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      status,
    }));
  }
  return [];
}

function isHealthy(status) {
  if (typeof status === "boolean") return status;
  if (typeof status === "string") return /^(operational|healthy|ok|up|connected)$/i.test(status);
  return false;
}

function displayStatus(status) {
  if (typeof status === "boolean") return status ? "Operational" : "Unknown";
  if (typeof status === "string" && status) return status.charAt(0).toUpperCase() + status.slice(1);
  return "Unknown";
}

export default function SystemHealth({ health }) {
  const entries = normalize(health);

  return (
    <div className="section-card">
      <div className="section-card-hdr">
        <h3>System status</h3>
      </div>
      <div className="section-card-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {entries.length === 0 ? (
          <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>No system status reported.</span>
        ) : (
          entries.map((e) => (
            <div className="flex-between" key={e.key}>
              <span style={{ fontSize: 12.5, color: "var(--text-2)" }}>{e.label}</span>
              <span
                className="status-badge"
                style={{
                  background: isHealthy(e.status) ? "var(--teal-bg)" : "var(--bg-3)",
                  color: isHealthy(e.status) ? "var(--teal)" : "var(--text-3)",
                }}
              >
                <span
                  className="status-dot"
                  style={{ background: isHealthy(e.status) ? "var(--teal)" : "var(--text-3)" }}
                />
                {displayStatus(e.status)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
