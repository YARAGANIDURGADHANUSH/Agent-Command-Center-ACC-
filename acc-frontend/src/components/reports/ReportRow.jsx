import { getReportId, getReportTitle } from "../../utils/report";

export default function ReportRow({ report, active, onClick }) {
  return (
    <div className={`list-row`} style={active ? { background: "var(--bg-2)" } : undefined} onClick={onClick}>
      <div>
        <div className="list-row-name">{getReportTitle(report)}</div>
        <div className="list-row-desc">{report.summary}</div>
        <div className="list-row-meta">
          <span className="tag text-mono">{getReportId(report)}</span>
          <span className="tag">{new Date(report.generated_at).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="list-row-arrow">→</div>
    </div>
  );
}
