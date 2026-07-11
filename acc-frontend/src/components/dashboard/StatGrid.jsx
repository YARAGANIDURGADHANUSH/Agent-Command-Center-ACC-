const CARDS = [
  { key: "running_missions", label: "Running missions" },
  { key: "completed_missions", label: "Completed missions" },
  { key: "queued_missions", label: "Queued missions" },
  { key: "connected_agents", label: "Connected agents" },
];

export default function StatGrid({ stats }) {
  return (
    <div className="stat-grid">
      {CARDS.map((c) => (
        <div className="stat-cell" key={c.key}>
          <div className="stat-n">{stats?.[c.key] ?? "—"}</div>
          <div className="stat-label">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
