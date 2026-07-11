import { useNavigate } from "react-router-dom";
import { Plus, FileText, Settings } from "lucide-react";

export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <div className="section-card">
      <div className="section-card-hdr">
        <h3>Quick actions</h3>
      </div>
      <div className="section-card-body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button className="btn primary" style={{ justifyContent: "flex-start" }} onClick={() => navigate("/missions?new=1")}>
          <Plus size={14} /> New mission
        </button>
        <button className="btn" style={{ justifyContent: "flex-start" }} onClick={() => navigate("/reports")}>
          <FileText size={14} /> View reports
        </button>
        <button className="btn" style={{ justifyContent: "flex-start" }} onClick={() => navigate("/settings")}>
          <Settings size={14} /> Settings
        </button>
      </div>
    </div>
  );
}
