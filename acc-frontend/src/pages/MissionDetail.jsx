import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Square, RotateCw, FileText } from "lucide-react";
import LoadingRow from "../components/common/LoadingRow";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import StatusBadge from "../components/common/StatusBadge";
import { useFetch } from "../hooks/useFetch";
import { missionsApi } from "../api/client";
import { useToast } from "../context/ToastContext";
import { normalizeStatus } from "../utils/status";

const POLL_MS = 4000;

export default function MissionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: mission, loading, error, refetch } = useFetch(() => missionsApi.get(id), [id], { pollMs: POLL_MS });
  const [actionPending, setActionPending] = useState(false);

  async function handleCancel() {
    setActionPending(true);
    try {
      await missionsApi.cancel(id);
      toast.success("Mission cancelled");
    } catch (err) {
      toast.error(`Couldn't cancel mission: ${err.message}`);
    } finally {
      setActionPending(false);
      refetch();
    }
  }

  async function handleRetry() {
    setActionPending(true);
    try {
      await missionsApi.retry(id);
      toast.success("Mission queued for retry");
    } catch (err) {
      toast.error(`Couldn't retry mission: ${err.message}`);
    } finally {
      setActionPending(false);
      refetch();
    }
  }

  if (loading) return <LoadingRow label="Loading mission…" />;

  if (error) {
    return <ErrorState error={error} onRetry={refetch} label="Couldn't load this mission" />;
  }

  if (!mission) {
    return (
      <EmptyState
        title="Mission not found"
        message="This mission may have been removed."
        action={
          <button className="btn sm" onClick={() => navigate("/missions")}>
            <ArrowLeft size={13} /> Back to missions
          </button>
        }
      />
    );
  }

  const status = normalizeStatus(mission.status);

  return (
    <>
      <button className="btn sm" style={{ marginBottom: 20 }} onClick={() => navigate("/missions")}>
        <ArrowLeft size={13} /> Back to missions
      </button>

      <div className="page-header">
        <div>
          <span className="eyebrow">{mission.id}</span>
          <h1 style={{ marginTop: 6 }}>{mission.title}</h1>
          <p style={{ maxWidth: 640 }}>{mission.objective}</p>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <StatusBadge status={mission.status} />
            <span className={`tag priority-${mission.priority}`}>{mission.priority} priority</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {(status === "running" || status === "queued") && (
            <button className="btn danger" onClick={handleCancel} disabled={actionPending}>
              <Square size={13} /> Cancel mission
            </button>
          )}
          {status === "failed" && (
            <button className="btn accent" onClick={handleRetry} disabled={actionPending}>
              <RotateCw size={13} /> Retry mission
            </button>
          )}
          {status === "completed" && (
            <Link className="btn" to={`/reports?mission=${mission.id}`}>
              <FileText size={13} /> View report
            </Link>
          )}
        </div>
      </div>

      <div className="section-card" style={{ maxWidth: 680 }}>
        <div className="section-card-hdr">
          <h3>Progress</h3>
          <span className="eyebrow">{mission.progress ?? 0}% complete</span>
        </div>
        <div className="section-card-body">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${mission.progress ?? 0}%` }} />
          </div>
        </div>
      </div>
    </>
  );
}
