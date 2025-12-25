import { useEffect, useState } from "react";
import { SessionsApi } from "../../api/sessions.api";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminSessionControl() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setError("");
        const data = await SessionsApi.getFullById(id);
        if (!cancelled) {
          setSession(data.session);
          setScenario(data.scenario);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load session");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!session || !scenario) {
    return <div style={{ padding: 16 }}>{error ? error : "Loading…"}</div>;
  }

  return (
    <div style={{ padding: 16, direction: "rtl", fontFamily: "sans-serif" }}>
      <h2>Game Control</h2>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ padding: 8, border: "1px solid #ddd", borderRadius: 8 }}>
          <strong>Session:</strong> {session._id}
        </div>
        <div style={{ padding: 8, border: "1px solid #ddd", borderRadius: 8 }}>
          <strong>Phase:</strong> {session.phase}
        </div>
      </div>
    </div>
  );
}
