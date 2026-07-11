import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Plus } from "lucide-react";

const TITLES = {
  "/": "dashboard",
  "/missions": "missions",
  "/agents": "agents",
  "/reports": "reports",
  "/settings": "settings",
};

export default function Topbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const current = TITLES[location.pathname] || location.pathname.split("/").filter(Boolean).pop() || "dashboard";

  return (
    <div className="topbar">
      <button className="hamburger" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={18} />
      </button>
      <div className="topbar-bc">
        <span>acc</span>
        <span className="sep">/</span>
        <span className="cur">{current}</span>
      </div>
      <div className="topbar-actions">
        <button className="btn primary sm" onClick={() => navigate("/missions?new=1")}>
          <Plus size={13} />
          New mission
        </button>
      </div>
    </div>
  );
}
