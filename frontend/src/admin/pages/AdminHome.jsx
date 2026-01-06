import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScenarioForm from "../components/ScenarioForm";
import ScenarioCard from "../components/ScenarioCard";
import Modal from "../ui/Modal";
import { adminTheme, createAdminStyles } from "../ui/adminTheme";
import { ScenariosApi } from "../../api/scenarios.api";
import { SessionsApi } from "../../api/sessions.api";
import SessionCard from "../components/SessionCard";

export default function AdminHome() {
  const theme = adminTheme;
  const styles = useMemo(() => createAdminStyles(theme), []);

  const [scenarios, setScenarios] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    ScenariosApi.getAll()
      .then(setScenarios)
      .catch((err) => {
        setError("Failed to load scenarios: " + err.message);
      });
    SessionsApi.getAll()
      .then(setSessions)
      .catch((err) => {
        setError("Failed to load sessions: " + (err.response?.data?.message || err.message));
      });
  }, []);

  async function startLive(scenarioId) {
    const session = await SessionsApi.create(scenarioId);
    navigate(`/admin/sessions/${session.id}`);
  }

  async function deleteScenario(id) {
    if (!window.confirm("Delete scenario?")) return;
    await ScenariosApi.remove(id);
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  }

  function findScenarioById(id) {
    return scenarios.find((s) => s.id === id);
  }

  function onGoToSession(session) {
    if (session.phase === "setup") {
      navigate(`/admin/sessions/${session.id}`);
      return;
    }

    if (session.phase === "reveal" || session.phase === "running") {
      navigate(`/admin/sessions/${session.id}/control`);
    }
  }

  async function onDeleteSession(id) {
    if (!window.confirm("Delete session?")) return;

    try {
      await SessionsApi.delete(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      alert("Failed to delete session");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin</h1>
        <button
          style={styles.buttonPrimary}
          onClick={() => setShowCreate(true)}
        >
          + Create Scenario
        </button>
      </div>

      <h2 style={styles.sectionTitle}>Sessions</h2>
      {error && <div style={styles.error}>{error}</div>}
      <div style={styles.grid}>
        {sessions.length > 0 ? (
          sessions.map((s) => (
            <SessionCard
              key={s.id}
              session={s}
              scenario={findScenarioById(s.scenarioId)}
              theme={theme}
              onGoToSession={onGoToSession}
              onDeleteSession={onDeleteSession}
            />
          ))
        ) : (
          <p style={styles.emptyState}>No sessions running right now</p>
        )}
      </div>

      <h2 style={styles.sectionTitle}>Scenarios</h2>
      <div style={styles.grid}>
        {scenarios.length > 0 ? (
          scenarios.map((s) => (
            <ScenarioCard
              key={s.id}
              scenario={s}
              theme={theme}
              onStartLive={startLive}
              onDelete={deleteScenario}
            />
          ))
        ) : (
          <p style={styles.emptyState}>No scenarios created yet</p>
        )}
      </div>

      {showCreate && (
        <Modal
          theme={theme}
          title="Create Scenario"
          onClose={() => setShowCreate(false)}
        >
          <ScenarioForm
            onCreated={(s) => {
              setScenarios((prev) => [...prev, s]);
              setShowCreate(false);
            }}
            onCancel={() => setShowCreate(false)}
          />
        </Modal>
      )}
    </div>
  );
}
