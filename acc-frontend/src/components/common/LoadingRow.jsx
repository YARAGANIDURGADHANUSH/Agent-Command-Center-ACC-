export default function LoadingRow({ label = "Loading…" }) {
  return (
    <div className="loading-row">
      <span className="spinner" />
      {label}
    </div>
  );
}
