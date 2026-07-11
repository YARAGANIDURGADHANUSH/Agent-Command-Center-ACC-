import { useMemo } from "react";
import PageHeader from "../components/common/PageHeader";
import LoadingRow from "../components/common/LoadingRow";
import ErrorState from "../components/common/ErrorState";
import StatGrid from "../components/dashboard/StatGrid";
import SystemHealth from "../components/dashboard/SystemHealth";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import QuickActions from "../components/dashboard/QuickActions";
import MissionTrend from "../components/dashboard/MissionTrend";
import { useFetch } from "../hooks/useFetch";
import { dashboardApi, missionsApi, reportsApi } from "../api/client";
import { getReportId, getReportTitle } from "../utils/report";
import { normalizeStatus } from "../utils/status";

const POLL_MS = 8000;

/**
 * There is no /activities endpoint on the backend. Recent Activity is
 * derived client-side from the missions and reports data already being
 * polled: mission creation/completion/failure and report generation each
 * become a feed entry, newest first.
 */
function buildActivity(missions, reports) {
  const events = [];

  (missions || []).forEach((m) => {
    const status = normalizeStatus(m.status);
    if (status === "completed") {
      events.push({
        id: `mission-completed-${m.id}`,
        type: "mission_completed",
        text: `**${m.title}** completed`,
        time: m.created_at,
      });
    } else if (status === "failed") {
      events.push({
        id: `mission-failed-${m.id}`,
        type: "mission_failed",
        text: `**${m.title}** failed`,
        time: m.created_at,
      });
    } else if (status === "running") {
      events.push({
        id: `mission-running-${m.id}`,
        type: "mission_started",
        text: `**${m.title}** is running`,
        time: m.created_at,
      });
    } else {
      events.push({
        id: `mission-queued-${m.id}`,
        type: "mission_started",
        text: `**${m.title}** queued`,
        time: m.created_at,
      });
    }
  });

  (reports || []).forEach((r) => {
    events.push({
      id: `report-${getReportId(r)}`,
      type: "mission_completed",
      text: `Report generated for **${getReportTitle(r)}**`,
      time: r.generated_at,
    });
  });

  return events
    .filter((e) => e.time)
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 12);
}

export default function Dashboard() {
  const { data: summary, loading: summaryLoading, error: summaryError, refetch: refetchSummary } = useFetch(
    () => dashboardApi.summary(),
    [],
    { pollMs: POLL_MS }
  );
  const { data: missions, error: missionsError, refetch: refetchMissions } = useFetch(
    () => missionsApi.list(),
    [],
    { pollMs: POLL_MS }
  );
  const { data: reports } = useFetch(() => reportsApi.list(), [], { pollMs: POLL_MS });

  const activity = useMemo(() => buildActivity(missions, reports), [missions, reports]);

  return (
    <>
      <PageHeader
        title="Mission control"
        description="A live view of every mission, agent, and system component ACC is currently coordinating."
      />

      {summaryLoading ? (
        <LoadingRow label="Loading mission statistics…" />
      ) : summaryError ? (
        <ErrorState error={summaryError} onRetry={refetchSummary} label="Couldn't load dashboard statistics" />
      ) : (
        <StatGrid stats={summary} />
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: 16,
          alignItems: "start",
          marginBottom: 16,
        }}
        className="dashboard-grid"
      >
        <MissionTrend missions={missions} />
        <SystemHealth health={summary?.system_health} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: 16,
          alignItems: "start",
        }}
        className="dashboard-grid"
      >
        {missionsError ? (
          <ErrorState error={missionsError} onRetry={refetchMissions} label="Couldn't load recent activity" />
        ) : (
          <ActivityFeed items={activity} />
        )}
        <QuickActions />
      </div>
    </>
  );
}
