import { useEffect, useState } from "react";

function App() {
  const [scenarios, setScenarios] = useState([]);   // List of scenarios
  const [loading, setLoading] = useState(true);     // Loading state
  const [error, setError] = useState(null);         // Error message
  const [showCreateForm, setShowCreateForm] = useState(false); // show "Create new scenartio ticket"

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
      
      {/* Show create new scenario ticket */ }
{showCreateForm && ( // אם showCreateForm = true, נציג את כל מה שבסוגריים
  <div
    style={{
      position: "fixed",
      inset: 0, // top:0, right:0, bottom:0, left:0 – מכסה את כל המסך
      backgroundColor: "rgba(0, 0, 0, 0.4)", // שכבה כהה שקופה
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }}
    onClick={() => setShowCreateForm(false)} // לחיצה על הרקע סוגרת את המודל
  >
    {/* זה ה"חלק הלבן" – החלון עצמו */}
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
      onClick={(e) => e.stopPropagation()} // לא להעביר את הלחיצה לרקע
    >
      {/* כותרת + כפתור X */}
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
          onClick={() => setShowCreateForm(false)} // לחיצה על X סוגרת
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

      {/* תוכן החלון – כרגע טקסט דמי */}
      <p style={{ marginTop: 0, marginBottom: 12 }}>
        כאן ניצור את הטופס – כרגע זה רק שלד ויזואלי של חלון קופץ 🙂
      </p>

      {/* כפתור סגירה בתוך החלון */}
      <button
        type="button"
        onClick={() => setShowCreateForm(false)} // גם כאן סוגר
        style={{
          marginTop: 8,
          padding: "6px 12px",
          borderRadius: 6,
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
      >
        סגור
      </button>
    </div>
  </div>
)}


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
        onClick={() => setShowCreateForm(true)}
      >
        + הוסף תרחיש חדש
      </button>
    </div>
  );
}

export default App;
