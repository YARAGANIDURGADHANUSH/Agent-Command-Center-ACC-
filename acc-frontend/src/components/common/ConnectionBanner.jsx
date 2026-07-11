import { useConnection } from "../../context/ConnectionContext";

export default function ConnectionBanner() {
  const { connected, baseUrl } = useConnection();

  if (connected !== false) return null;

  return (
    <div className="conn-banner">
      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      Can't reach the ACC backend at <code style={{ background: "transparent", color: "inherit", padding: 0 }}>{baseUrl}</code>. Start the backend or update{" "}
      <code style={{ background: "transparent", color: "inherit", padding: 0 }}>VITE_API_BASE_URL</code> — pages will keep retrying automatically.
    </div>
  );
}
