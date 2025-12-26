// src/pages/AdminLiveSession.jsx
import { useEffect, useState } from "react";
import { SessionsApi } from "../../api/sessions.api";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminLiveSession() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [desiredPlayers, setDesiredPlayers] = useState(0);
  const [mode, setMode] = useState("slow"); // fast | slow
  const [busy, setBusy] = useState(false);
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
          setDesiredPlayers(data.session.playerCount);
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

  if (!session || !scenario) return <div style={{ padding: 16 }}>Loading…</div>;

  const chars = scenario.characters || [];
  const mandatoryChars = chars.filter((c) => c.required);
  const optionalChars = chars.filter((c) => !c.required);
  const currentPlayers = session.slots?.length ?? 0;
  const canAddMore = currentPlayers < desiredPlayers;

  async function addOptional(characterId) {
    try {
      setError("");
      const updated = await SessionsApi.addSlot(session._id, characterId);
      setSession(updated);
    } catch (e) {
      setError(e.message || "Failed to add character");
    }
  }

  async function savePhoto(slotIndex, photoUrl) {
    try {
      setBusy(true);
      setError("");

      const updatedSession = await SessionsApi.setSlotPhoto(
        session._id,
        slotIndex,
        photoUrl
      );

      setSession(updatedSession);
    } catch (err) {
      setError(err.message || "Failed to save photo");
    } finally {
      setBusy(false);
    }
  }

  async function startSession() {
    try {
      setBusy(true);
      setError("");

      const updatedSession = await SessionsApi.start(session._id, mode);
      setSession(updatedSession);
      navigate(`/admin/sessions/${id}/control`);
    } catch (err) {
      setError(err.message || "Failed to start session");
    } finally {
      setBusy(false);
    }
  }

  async function handleSetPhoto(slot) {
    if (busy) return;

    const current = slot.photoUrl || "";
    const url = window.prompt(
      `Paste photo URL for slot ${slot.slotIndex}:`,
      current
    );

    if (url == null) return; // user cancelled

    const trimmed = url.trim();
    if (!trimmed) return;

    await savePhoto(slot.slotIndex, trimmed);
  }

  return (
    <div style={{ padding: 16, direction: "rtl", fontFamily: "sans-serif" }}>
      <h2>Live Session</h2>
      {error && (
        <div
          style={{
            marginBottom: 12,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #f5c2c7",
            background: "#f8d7da",
            color: "#842029",
          }}
        >
          {error}
        </div>
      )}

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
      {/* PLAY controls (setup only) */}
      {session.phase === "setup" && (
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 12,
            padding: 12,
            border: "1px solid #ddd",
            borderRadius: 8,
            background: "#fafafa",
          }}
        >
          <strong>PLAY:</strong>

          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="radio"
              name="revealMode"
              value="slow"
              checked={mode === "slow"}
              onChange={() => setMode("slow")}
              disabled={busy}
            />
            Slow
          </label>

          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="radio"
              name="revealMode"
              value="fast"
              checked={mode === "fast"}
              onChange={() => setMode("fast")}
              disabled={busy}
            />
            Fast
          </label>

          <button
            type="button"
            onClick={startSession}
            disabled={busy}
            style={{
              padding: "8px 14px",
              cursor: busy ? "not-allowed" : "pointer",
              fontWeight: 700,
            }}
            title="Start reveal phase"
          >
            PLAY
          </button>

          <span style={{ opacity: 0.8 }}>(צריך תמונה לכל דמות לפני PLAY)</span>
        </div>
      )}

      <div
        style={{
          marginBottom: 12,
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <strong>מספר שחקנים:</strong>

        <select
          value={desiredPlayers}
          onChange={(e) => setDesiredPlayers(Number(e.target.value))}
        >
          {Array.from(
            { length: optionalChars.length + 1 },
            (_, i) => mandatoryChars.length + i
          ).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <span style={{ opacity: 0.8 }}>
          נבחרו: {currentPlayers} / {desiredPlayers}
        </span>
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
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    color: slot.photoUrl ? "green" : "crimson",
                  }}
                >
                  {slot.photoUrl ? "OK" : "Missing photo"}
                </div>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => handleSetPhoto(slot)}
              >
                Set Photo
              </button>
            </div>
          ))}
        </div>
      )}
      <div
        style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 240,
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <strong>דמויות חובה</strong>
          <ul>
            {mandatoryChars.map((c) => (
              <li key={c._id}>{c.name}</li>
            ))}
          </ul>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 240,
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <strong>דמויות לא חובה</strong>
          <ul style={{ paddingInlineStart: 18 }}>
            {optionalChars.map((c) => {
              const isPicked = (session.slots || []).some(
                (s) => String(s.characterId) === String(c._id)
              );
              const disabled = isPicked || !canAddMore;

              return (
                <li
                  key={c._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => addOptional(c._id)}
                    disabled={disabled}
                    style={{
                      width: 28,
                      height: 28,
                      cursor: disabled ? "not-allowed" : "pointer",
                    }}
                    title={
                      isPicked
                        ? "כבר נבחרה"
                        : !canAddMore
                        ? "הגעת למספר השחקנים"
                        : "הוסף"
                    }
                  >
                    +
                  </button>

                  <span style={{ opacity: isPicked ? 0.6 : 1 }}>
                    {c.name} {isPicked ? "(נבחרה)" : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
