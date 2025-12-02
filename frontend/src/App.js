import { useEffect, useState } from "react";

function App() {
  const [scenarios, setScenarios] = useState([]);   // List of scenarios
  const [loading, setLoading] = useState(true);     // Loading state
  const [error, setError] = useState(null);         // Error message

  // Load all scenarios from backend when component mounts
  useEffect(() => {
    fetch("http://localhost:5000/api/scenarios")
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

  return (
    <div style={{ padding: 24, direction: "rtl", fontFamily: "sans-serif" }}>
      <h1>אזור אדמין – תרחישים 🎭</h1>

      {/* Loading / Error states */}
      {loading && <p>טוען תרחישים...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Empty state */}
      {!loading && !error && scenarios.length === 0 && (
        <p>אין עדיין תרחישים 😅</p>
      )}

      {/* Scenario cards */}
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

              {s.description && (
                <p style={{ marginTop: 4 }}>{s.description}</p>
              )}

              {(s.minPlayers || s.maxPlayers) && (
                <p style={{ fontSize: 14, marginTop: 4, opacity: 0.8 }}>
                  שחקנים: {s.minPlayers ?? "?"}–{s.maxPlayers ?? "?"}
                </p>
              )}
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
        onClick={() => alert("בשלב הבא נפתח מסך יצירת תרחיש חדש 🙂")}
      >
        + הוסף תרחיש חדש
      </button>
    </div>
  );
}

export default App;
