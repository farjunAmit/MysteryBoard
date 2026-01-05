import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScenarioForm from "../components/ScenarioForm";
import ScenarioCard from "../components/ScenarioCard";
import Modal from "../ui/Modal";
import { adminTheme, createAdminStyles } from "../ui/adminTheme";
import { ScenariosApi } from "../../api/scenarios.api";
import { SessionsApi } from "../../api/sessions.api";

export default function AdminHome() {
  const theme = adminTheme;
  const styles = useMemo(() => createAdminStyles(theme), []);

  const [scenarios, setScenarios] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    ScenariosApi.getAll()
      .then(setScenarios)
      .catch(() => setError("Failed to load scenarios"));
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

      {/* Future: Active Sessions */}

      <h2 style={styles.sectionTitle}>Scenarios</h2>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.grid}>
        {scenarios.map((s) => (
          <ScenarioCard
            key={s.id}
            scenario={s}
            theme={theme}
            onStartLive={startLive}
            onDelete={deleteScenario}
          />
        ))}
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
