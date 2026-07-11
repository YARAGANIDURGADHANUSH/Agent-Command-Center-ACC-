import { Bot } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import LoadingRow from "../components/common/LoadingRow";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import AgentCard from "../components/agents/AgentCard";
import { useFetch } from "../hooks/useFetch";
import { agentsApi } from "../api/client";

const POLL_MS = 5000;

export default function Agents() {
  const { data: agents, loading, error, refetch } = useFetch(() => agentsApi.list(), [], { pollMs: POLL_MS });

  return (
    <>
      <PageHeader
        title="Agents"
        description="Coordinator, Planner, Research, and Writer — the specialized agents ACC orchestrates for every mission."
        actions={
          <button className="btn sm" onClick={refetch}>
            Refresh
          </button>
        }
      />

      {loading ? (
        <LoadingRow label="Checking agent status…" />
      ) : error ? (
        <ErrorState error={error} onRetry={refetch} label="Couldn't load agent status" />
      ) : !agents?.length ? (
        <EmptyState icon={<Bot size={18} />} title="No agents connected" message="Agents will appear here once the backend registers them." />
      ) : (
        <div className="card-grid">
          {agents.map((agent) => (
            <AgentCard key={agent.name} agent={agent} />
          ))}
        </div>
      )}
    </>
  );
}
