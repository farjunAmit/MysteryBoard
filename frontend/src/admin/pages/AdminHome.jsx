import { useEffect, useState } from "react";
import ScenarioForm from "../components/ScenarioForm";
import { API_BASE_URL } from "../config/api";

function AdminHome() {
  const [scenarios, setScenarios] = useState([]); // List of scenarios from backend
  const [loading, setLoading] = useState(true); // Loading state
  const [showCreateForm, setShowCreateForm] = useState(false); // Show/Hide modal for creating a new scenario
  const [error, setError] = useState(null); // Error message
  const [createError, setCreateError] = useState(null); //Error message for create scenario fail

  // Load all scenarios when component mounts
  useEffect(() => {
    fetch(`${API_BASE_URL}${API_PATHS.scenarios}`)
      .then((res) => res.json())
      .then((data) => {
        setScenarios(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading scenarios:", err);
        setError("שגיאה בטעינת התרחישים");
        setLoading(false);
      });
  }, []);

  async function handleScenarioCreated(payload) {
    try {
      const res = await fetch(`${API_BASE_URL}${API_PATHS.scenarios}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      console.log("create status:", res.status);
      console.log("create body:", await res.clone().json());
      if (!res.ok) {
        const errorData = await res.json();
        setCreateError(errorData.error || "שגיאה ביצירת תרחיש");
        return;
      }

      const createdScenario = await res.json();
      setScenarios((prev) => [...prev, createdScenario]);
      setShowCreateForm(false);
    } catch (err) {
      console.error(err);
      setCreateError("שגיאה בתקשורת עם השרת");
    }
  }

  async function handleScenarioDelete(id) {
    if (!window.confirm("למחוק את התרחיש?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}${API_PATHS.scenarios}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "שגיאה במחיקת תרחיש");
        return;
      }
      setScenarios((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      setError("שגיאה בתקשורת עם השרת");
    }
  }

  return (
    <div style={{ padding: 24, direction: "rtl", fontFamily: "sans-serif" }}>
      <h1>אזור אדמין – תרחישים 🎭</h1>

      {/* Modal for creating a new scenario */}
      {showCreateForm && (
        <div
          style={{
            position: "fixed",
            inset: 0, // covers the entire screen
            backgroundColor: "rgba(0, 0, 0, 0.4)", // transparent dark overlay
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowCreateForm(false)} // clicking outside closes modal
        >
          {/* Modal content container */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              padding: 20,
              minWidth: 320,
              maxWidth: 500,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              direction: "rtl",
            }}
            onClick={(e) => e.stopPropagation()} // prevent modal close on inner click
          >
            {/* Modal header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <h2 style={{ margin: 0 }}>יצירת לוח / תרחיש חדש</h2>
              <button
                onClick={() => setShowCreateForm(false)} // close modal
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: 18,
                  cursor: "pointer",
                }}
                type="button"
              >
                ✕
              </button>
            </div>
            <ScenarioForm
              onCancel={() => setShowCreateForm(false)}
              onCreated={(payload) => handleScenarioCreated(payload)}
            />
          </div>
        </div>
      )}

      {/* Loading / error states */}
      {loading && <p>טוען תרחישים...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Empty list message */}
      {!loading && !error && scenarios.length === 0 && (
        <p>אין עדיין תרחישים 😅</p>
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
                  שחקנים: {s.minPlayers ?? "?"}–{s.maxPlayers ?? "?"}
                </p>
              )}
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
                מחק
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
        + הוסף תרחיש חדש
      </button>
    </div>
  );
}

export default AdminHome;
