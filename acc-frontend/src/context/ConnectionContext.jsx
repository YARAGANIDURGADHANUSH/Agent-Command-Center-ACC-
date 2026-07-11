import { createContext, useContext, useEffect, useState } from "react";
import { onConnectionChange, probeBackend, BASE_URL } from "../api/client";

const ConnectionContext = createContext(null);
const PROBE_INTERVAL_MS = 15000;

export function ConnectionProvider({ children }) {
  // null = checking, true = backend reachable, false = unreachable
  const [connected, setConnected] = useState(null);

  useEffect(() => {
    probeBackend().then(setConnected);
    const unsubscribe = onConnectionChange(setConnected);

    // Keep re-probing in the background so the banner clears itself the
    // moment the backend comes up, without needing a page refresh.
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") probeBackend().then(setConnected);
    }, PROBE_INTERVAL_MS);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return (
    <ConnectionContext.Provider value={{ connected, baseUrl: BASE_URL }}>{children}</ConnectionContext.Provider>
  );
}

export function useConnection() {
  const ctx = useContext(ConnectionContext);
  if (!ctx) throw new Error("useConnection must be used within ConnectionProvider");
  return ctx;
}
