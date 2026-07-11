function formatTime(iso) {
  if (!iso) return "Pending";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MissionPipeline({ stages = [] }) {
  return (
    <div className="pipeline">
      {stages.map((stage, i) => (
        <div className="pipe-step" key={i}>
          <span className={`pipe-dot ${stage.status}`} />
          <div className="pipe-title">{stage.name}</div>
          <div className="pipe-meta">{formatTime(stage.time)}</div>
        </div>
      ))}
    </div>
  );
}
