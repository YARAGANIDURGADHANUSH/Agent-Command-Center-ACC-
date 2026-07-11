import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Flag, Plus, Search } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import LoadingRow from "../components/common/LoadingRow";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import MissionRow from "../components/missions/MissionRow";
import NewMissionModal from "../components/missions/NewMissionModal";
import { useFetch } from "../hooks/useFetch";
import { missionsApi } from "../api/client";
import { useToast } from "../context/ToastContext";
import { normalizeStatus } from "../utils/status";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "running", label: "Running" },
  { key: "queued", label: "Queued" },
  { key: "completed", label: "Completed" },
  { key: "failed", label: "Failed" },
];

const POLL_MS = 6000;

export default function Missions() {
  const { data: missions, loading, error, refetch } = useFetch(() => missionsApi.list(), [], { pollMs: POLL_MS });
  const toast = useToast();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [showNew, setShowNew] = useState(searchParams.get("new") === "1");
  const [optimistic, setOptimistic] = useState([]);
  const [busyId, setBusyId] = useState(null);

  const closeModal = () => {
    setShowNew(false);
    searchParams.delete("new");
    setSearchParams(searchParams, { replace: true });
  };

  const openModal = () => setShowNew(true);

  const handleCreated = (mission) => {
    setOptimistic((prev) => [mission, ...prev]);
    closeModal();
    refetch();
  };

  async function handleCancel(id) {
    setBusyId(id);
    try {
      await missionsApi.cancel(id);
      toast.success("Mission cancelled");
      refetch();
    } catch (err) {
      toast.error(`Couldn't cancel mission: ${err.message}`);
    } finally {
      setBusyId(null);
    }
  }

  async function handleRetry(id) {
    setBusyId(id);
    try {
      await missionsApi.retry(id);
      toast.success("Mission queued for retry");
      refetch();
    } catch (err) {
      toast.error(`Couldn't retry mission: ${err.message}`);
    } finally {
      setBusyId(null);
    }
  }

  const allMissions = useMemo(() => {
    const merged = [...optimistic, ...(missions || [])];
    const seen = new Set();
    return merged.filter((m) => (seen.has(m.id) ? false : (seen.add(m.id), true)));
  }, [optimistic, missions]);

  const filtered = allMissions.filter((m) => {
    const matchesFilter = filter === "all" || normalizeStatus(m.status) === filter;
    const matchesQuery = m.title.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <>
      <PageHeader
        title="Missions"
        description="Define an objective and ACC will orchestrate the coordinator, planner, research, and writer agents to complete it."
        actions={
          <button className="btn primary" onClick={openModal}>
            <Plus size={14} /> New mission
          </button>
        }
      />

      <div className="filter-row">
        {FILTERS.map((f) => (
          <button key={f.key} className={`fbtn ${filter === f.key ? "active" : ""}`} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
        <div className="search-input">
          <Search size={13} />
          <input placeholder="Search missions…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <LoadingRow label="Loading missions…" />
      ) : error ? (
        <ErrorState error={error} onRetry={refetch} label="Couldn't load missions" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Flag size={18} />}
          title="No missions found"
          message="Try a different filter, or create a new mission to get ACC started."
          action={
            <button className="btn primary sm" onClick={openModal}>
              <Plus size={13} /> New mission
            </button>
          }
        />
      ) : (
        <div className="row-list">
          {filtered.map((m) => (
            <MissionRow
              key={m.id}
              mission={m}
              busy={busyId === m.id}
              onCancel={() => handleCancel(m.id)}
              onRetry={() => handleRetry(m.id)}
            />
          ))}
        </div>
      )}

      {showNew && <NewMissionModal onClose={closeModal} onCreated={handleCreated} />}
    </>
  );
}
