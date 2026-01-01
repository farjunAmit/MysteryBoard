import { useCallback, useEffect, useRef, useState } from "react";
import { ClientSessionsApi } from "../../api/clientSessions.api";

/**
 * useClientSession
 * Loads the client session "state" by sessionId using ClientSessionsApi.getState.
 *
 * Returns: { data, loading, error, refetch }
 *
 * options:
 *  - enabled (default true): if false, won't fetch
 *  - pollMs (default 0): if > 0, refetch every X ms
 */
export function useClientSession(sessionId, options = {}) {
  const { enabled = true, pollMs = 0 } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(enabled && sessionId));
  const [error, setError] = useState("");

  // protects from setting state after unmount / overlapping requests
  const aliveRef = useRef(true);
  const requestIdRef = useRef(0);

  const refetch = useCallback(async () => {
    if (!enabled || !sessionId) return;

    const reqId = ++requestIdRef.current;

    try {
      setError("");
      setLoading(true);

      const payload = await ClientSessionsApi.getState(sessionId);

      // ignore stale responses
      if (!aliveRef.current || reqId !== requestIdRef.current) return;
      setData(payload);
    } catch (e) {
      if (!aliveRef.current || reqId !== requestIdRef.current) return;
      setError(e?.message || "Failed to load session");
    } finally {
      if (!aliveRef.current || reqId !== requestIdRef.current) return;
      setLoading(false);
    }
  }, [enabled, sessionId]);

  useEffect(() => {
    aliveRef.current = true;
    refetch();

    return () => {
      aliveRef.current = false;
    };
  }, [refetch]);

  useEffect(() => {
    if (!enabled || !sessionId || !pollMs) return;

    const id = setInterval(() => {
      refetch();
    }, pollMs);

    return () => clearInterval(id);
  }, [enabled, sessionId, pollMs, refetch]);

  return { data, loading, error, refetch };
}
