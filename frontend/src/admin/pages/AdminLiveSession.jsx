// src/pages/AdminLiveSession.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SessionsApi } from "../../api/sessions.api";

export default function AdminLiveSession() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setError("");
        const data = await SessionsApi.getById(id);
        if (!cancelled) setSession(data);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load session");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error)
    return <div style={{ padding: 16, color: "crimson" }}>{error}</div>;
  if (!session) return <div style={{ padding: 16 }}>Loading…</div>;

  return (
    <div style={{ padding: 16, direction: "rtl", fontFamily: "sans-serif" }}>
      <h2>Live Session</h2>

      <div
        style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}
      >
        <div style={{ padding: 8, border: "1px solid #ddd", borderRadius: 8 }}>
          <strong>Session ID:</strong> {session._id}
        </div>
        <div style={{ padding: 8, border: "1px solid #ddd", borderRadius: 8 }}>
          <strong>Phase:</strong> {session.phase}
        </div>
        <div style={{ padding: 8, border: "1px solid #ddd", borderRadius: 8 }}>
          <strong>Players:</strong> {session.playerCount}
        </div>
        <div style={{ padding: 8, border: "1px solid #ddd", borderRadius: 8 }}>
          <strong>Slots:</strong> {session.slots?.length ?? 0}
        </div>
      </div>

      {!session.slots || session.slots.length === 0 ? (
        <p style={{ opacity: 0.8 }}>
          אין סלוטים בסשן הזה. כנראה שאין דמויות חובה בתרחיש שנבחר.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {session.slots.map((slot) => (
            <div
              key={slot.slotIndex}
              style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                padding: 12,
                background: "#f8f8f8",
              }}
            >
              <div>
                <strong>Slot:</strong> {slot.slotIndex}
              </div>
              <div style={{ wordBreak: "break-all" }}>
                <strong>CharacterId:</strong> {slot.characterId}
              </div>
              <div style={{ marginTop: 8 }}>
                <strong>Photo:</strong>{" "}
                {slot.photoUrl ? (
                  <a href={slot.photoUrl} target="_blank" rel="noreferrer">
                    Open
                  </a>
                ) : (
                  <span>לא הוגדרה</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
