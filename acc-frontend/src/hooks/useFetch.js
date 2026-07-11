import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Runs an api/client.js call, tracks loading/error/data state, and exposes
 * refetch(). Pass a positive `pollMs` to re-run the call on an interval —
 * used for anything that reflects live backend state (dashboard, agents,
 * a running mission). Polling pauses while the tab is hidden.
 */
export function useFetch(fn, deps = [], { pollMs = 0 } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const firstLoad = useRef(true);

  const run = useCallback(() => {
    let cancelled = false;
    if (firstLoad.current) setLoading(true);
    fn()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          firstLoad.current = false;
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const manualRefetch = useCallback(() => {
    firstLoad.current = true;
    setLoading(true);
    return run();
  }, [run]);

  useEffect(() => {
    firstLoad.current = true;
    const cleanup = run();
    if (!pollMs) return cleanup;

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") run();
    }, pollMs);
    return () => {
      cleanup();
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, pollMs]);

  return { data, loading, error, refetch: manualRefetch };
}
