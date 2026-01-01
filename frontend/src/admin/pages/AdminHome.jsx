import { useEffect, useState } from "react";
import ScenarioForm from "../components/ScenarioForm";
import { SessionsApi } from "../../api/sessions.api";
import { ScenariosApi } from "../../api/scenarios.api";
import { useNavigate } from "react-router-dom";
import { texts as t } from "../../texts";

function AdminHome() {
  const [scenarios, setScenarios] = useState([]); // List of scenarios from backend
  const [loading, setLoading] = useState(true); // Loading state
  const [showCreateForm, setShowCreateForm] = useState(false); // Show/Hide modal for creating a new scenario
  const [error, setError] = useState(null); // Error message
  const [createError, setCreateError] = useState(null); // Error message for create scenario fail
  const navigate = useNavigate();

  // Load all scenarios when component mounts
  useEffect(() => {
    (async () => {
      try {
        const data = await ScenariosApi.getAll();
        setScenarios(data);
      } catch (err) {
        console.error("Error loading scenarios:", err);
        setError(t.admin.adminHome.errors.loadScenarios);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleStartLive(scenarioId) {
    try {
      setError(null);
      const createdSession = await SessionsApi.create(scenarioId);
      navigate(`/admin/sessions/${createdSession.id}`);
    } catch (err) {
      console.error(err);
      setError(err?.message || t.admin.adminHome.errors.createSession);
    }
  }

  async function handleScenarioCreated(payload) {
    try {
      setCreateError(null);
      const createdScenario = await ScenariosApi.create(payload);
      setScenarios((prev) => [...prev, createdScenario]);
      setShowCreateForm(false);
    } catch (err) {
      console.error(err);
      setCreateError(
        err?.message || t.admin.adminHome.errors.serverCommunication
      );
    }
  }

  async function handleScenarioDelete(id) {
    if (!window.confirm(t.admin.adminHome.confirm.deleteScenario)) return;

    try {
      setError(null);
      await ScenariosApi.remove(id);
      setScenarios((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      setError(err?.message || t.admin.adminHome.errors.serverCommunication);
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>{t.admin.adminHome.title}</h1>

      {/* Modal for creating a new scenario */}
      {showCreateForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowCreateForm(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              padding: 20,
              minWidth: 320,
              maxWidth: 500,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <h2 style={{ margin: 0 }}>{t.admin.adminHome.modal.title}</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: 18,
                  cursor: "pointer",
                }}
                type="button"
                aria-label={t.admin.adminHome.modal.close}
                title={t.admin.adminHome.modal.close}
              >
                ✕
              </button>
            </div>

            {createError && <p style={{ color: "red" }}>{createError}</p>}

            <ScenarioForm
              onCancel={() => setShowCreateForm(false)}
              onCreated={handleScenarioCreated}
            />
          </div>
        </div>
      )}

      {/* Loading / error states */}
      {loading && <p>{t.admin.adminHome.states.loading}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Empty list message */}
      {!loading && !error && scenarios.length === 0 && (
        <p>{t.admin.adminHome.states.empty}</p>
      )}

      {/* Display scenario cards */}
      {!loading && !error && scenarios.length > 0 && (
        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            marginTop: 16,
          }}
        >
          {scenarios.map((s) => (
            <div
              key={s.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 12,
                backgroundColor: "#f8f8f8",
              }}
            >
              {s.imageUrl && (
                <img
                  src={s.imageUrl}
                  alt={s.name}
                  style={{
                    width: "100%",
                    maxHeight: 150,
                    objectFit: "cover",
                    borderRadius: 6,
                    marginBottom: 8,
                  }}
                />
              )}

              <strong>{s.name}</strong>

              {s.description && <p style={{ marginTop: 4 }}>{s.description}</p>}

              {(s.minPlayers || s.maxPlayers) && (
                <p style={{ fontSize: 14, marginTop: 4, opacity: 0.8 }}>
                  {t.admin.adminHome.labels.players}:{" "}
                  {s.minPlayers ?? t.admin.adminHome.labels.unknown}–
                  {s.maxPlayers ?? t.admin.adminHome.labels.unknown}
                </p>
              )}

              <button
                type="button"
                onClick={() => handleStartLive(s.id)}
                style={{
                  marginTop: 8,
                  marginLeft: 8,
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "#2ecc71",
                  color: "white",
                }}
              >
                {t.admin.adminHome.actions.openLive}
              </button>

              <button
                type="button"
                onClick={() => handleScenarioDelete(s.id)}
                style={{
                  marginTop: 8,
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "#e74c3c",
                  color: "white",
                }}
              >
                {t.admin.adminHome.actions.delete}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new scenario button */}
      <button
        style={{
          marginTop: 24,
          padding: "10px 18px",
          fontSize: 16,
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
        }}
        onClick={() => setShowCreateForm(true)}
      >
        {t.admin.adminHome.actions.addNewScenario}
      </button>
    </div>
  );
}

export default AdminHome;
