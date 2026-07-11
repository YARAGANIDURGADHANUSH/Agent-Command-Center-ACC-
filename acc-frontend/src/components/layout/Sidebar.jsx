import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Flag,
  Bot,
  FileText,
  Settings,
  Sun,
  Moon,
  Github,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useConnection } from "../../context/ConnectionContext";

const NAV_ITEMS = [
  { section: "Operations", items: [
    { label: "Dashboard", to: "/", icon: LayoutDashboard, end: true },
    { label: "Missions", to: "/missions", icon: Flag },
    { label: "Agents", to: "/agents", icon: Bot },
  ]},
  { section: "Output", items: [
    { label: "Reports", to: "/reports", icon: FileText },
  ]},
  { section: "System", items: [
    { label: "Settings", to: "/settings", icon: Settings },
  ]},
];

export default function Sidebar({ open, onClose }) {
  const { theme, toggleTheme } = useTheme();
  const { connected } = useConnection();

  const dotColor = connected === null ? "var(--text-3)" : connected ? "var(--teal)" : "var(--red)";
  const dotLabel = connected === null ? "Checking backend…" : connected ? "Backend connected" : "Backend unreachable";

  return (
    <>
      <div className={`sidebar-backdrop ${open ? "open" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-mark">ACC</div>
          <div>
            <div className="sidebar-title">Agent Command Center</div>
            <div className="sidebar-subtitle">Command. Coordinate. Accomplish.</div>
          </div>
        </div>

        <div className="env-pill">
          <span className="env-dot" style={{ background: dotColor }} />
          {dotLabel}
        </div>

        {NAV_ITEMS.map((group) => (
          <div className="nav-section" key={group.section}>
            <div className="nav-section-label">{group.section}</div>
            {group.items.map(({ label, to, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onClose}
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              >
                <Icon className="nav-icon" size={15} />
                {label}
              </NavLink>
            ))}
          </div>
        ))}

        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
            {theme === "light" ? "Dark" : "Light"}
          </button>
          <a className="btn icon-only sm" href="https://github.com" target="_blank" rel="noreferrer" title="Repository">
            <Github size={14} />
          </a>
        </div>
      </aside>
    </>
  );
}
