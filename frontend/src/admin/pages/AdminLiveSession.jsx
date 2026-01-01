// src/pages/AdminLiveSession.jsx
import { useEffect, useState } from "react";
import { SessionsApi } from "../../api/sessions.api";
import { useParams, useNavigate } from "react-router-dom";
import { texts as t } from "../../texts";

export default function AdminLiveSession() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [desiredPlayers, setDesiredPlayers] = useState(0);
  const [mode, setMode] = useState("slow"); // fast | slow
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const sessionId = session?.id ?? session?._id;
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
        if (!cancelled) setError(e?.message || t.admin.liveSession.errors.load);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!session || !scenario) {
    return <div style={{ padding: 16 }}>{t.common.status.loading}</div>;
  }

  const chars = scenario.characters || [];
  const mandatoryChars = chars.filter((c) => c.required);
  const optionalChars = chars.filter((c) => !c.required);
  const currentPlayers = session.slots?.length ?? 0;
  const canAddMore = currentPlayers < desiredPlayers;

  async function addOptional(characterId) {
    try {
      setError("");
      const updated = await SessionsApi.addSlot(sessionId, characterId);
      setSession(updated);
    } catch (e) {
      setError(e?.message || t.admin.liveSession.errors.addCharacter);
    }
  }

  async function savePhoto(slotIndex, photoUrl) {
    try {
      setBusy(true);
      setError("");

      const updatedSession = await SessionsApi.setSlotPhoto(
        sessionId,
        slotIndex,
        photoUrl
      );

      setSession(updatedSession);
    } catch (err) {
      setError(err?.message || t.admin.liveSession.errors.savePhoto);
    } finally {
      setBusy(false);
    }
  }

  async function startSession() {
    try {
      setBusy(true);
      setError("");

      const updatedSession = await SessionsApi.start(sessionId, mode);
      setSession(updatedSession);
      navigate(`/admin/sessions/${id}/control`);
    } catch (err) {
      setError(err?.message || t.admin.liveSession.errors.startSession);
    } finally {
      setBusy(false);
    }
  }

  async function handleSetPhoto(slot) {
    if (busy) return;

    const current = slot.photoUrl || "";
    const url = window.prompt(
      t.admin.liveSession.prompts.photoUrl(slot.slotIndex),
      current
    );

    if (url == null) return;

    const trimmed = url.trim();
    if (!trimmed) return;

    await savePhoto(slot.slotIndex, trimmed);
  }

  const allPhotosPresent =
    (session.slots || []).length > 0 &&
    (session.slots || []).every((s) => Boolean(s.photoUrl));
  const canPlay = session.phase === "setup" && allPhotosPresent && !busy;

  return (
    <div style={{ padding: 16, fontFamily: "sans-serif" }}>
      <h2>{t.admin.liveSession.title}</h2>

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
          <strong>{t.admin.liveSession.meta.sessionId}:</strong> {sessionId}
        </div>
        <div style={{ padding: 8, border: "1px solid #ddd", borderRadius: 8 }}>
          <strong>{t.admin.liveSession.meta.phase}:</strong> {session.phase}
        </div>
        <div style={{ padding: 8, border: "1px solid #ddd", borderRadius: 8 }}>
          <strong>{t.admin.liveSession.meta.players}:</strong>{" "}
          {session.playerCount}
        </div>
        <div style={{ padding: 8, border: "1px solid #ddd", borderRadius: 8 }}>
          <strong>{t.admin.liveSession.meta.slots}:</strong>{" "}
          {session.slots?.length ?? 0}
        </div>
      </div>

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
          <strong>{t.admin.liveSession.play.label}</strong>

          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="radio"
              name="revealMode"
              value="slow"
              checked={mode === "slow"}
              onChange={() => setMode("slow")}
              disabled={busy}
            />
            {t.admin.liveSession.play.modes.slow}
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
            {t.admin.liveSession.play.modes.fast}
          </label>

          <button
            type="button"
            onClick={startSession}
            disabled={!canPlay}
            style={{
              padding: "8px 14px",
              cursor: canPlay ? "pointer" : "not-allowed",
              fontWeight: 700,
            }}
            title={t.admin.liveSession.play.startTitle}
          >
            {t.admin.liveSession.play.start}
          </button>

          <span style={{ opacity: 0.8 }}>{t.admin.liveSession.play.hint}</span>
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
        <strong>{t.admin.liveSession.desiredPlayers.label}</strong>

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
          {t.admin.liveSession.desiredPlayers.selected} {currentPlayers} /{" "}
          {desiredPlayers}
        </span>
      </div>

      {!session.slots || session.slots.length === 0 ? (
        <p style={{ opacity: 0.8 }}>{t.admin.liveSession.states.noSlots}</p>
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
                <strong>{t.admin.liveSession.slots.slot}:</strong>{" "}
                {slot.slotIndex}
              </div>
              <div style={{ wordBreak: "break-all" }}>
                <strong>{t.admin.liveSession.slots.characterId}:</strong>{" "}
                {slot.characterId}
              </div>
              <div style={{ marginTop: 8 }}>
                <strong>{t.admin.liveSession.slots.photo}:</strong>{" "}
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    color: slot.photoUrl ? "green" : "crimson",
                  }}
                >
                  {slot.photoUrl
                    ? t.admin.liveSession.slots.photoOk
                    : t.admin.liveSession.slots.photoMissing}
                </div>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => handleSetPhoto(slot)}
              >
                {t.admin.liveSession.slots.setPhoto}
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
          <strong>{t.admin.liveSession.characters.mandatory}</strong>
          <ul>
            {mandatoryChars.map((c) => (
              <li key={c.id}>{c.name}</li>
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
          <strong>{t.admin.liveSession.characters.optional}</strong>
          <ul style={{ paddingInlineStart: 18 }}>
            {optionalChars.map((c) => {
              const isPicked = (session.slots || []).some(
                (s) => String(s.characterId) === String(c.id)
              );
              const disabled = isPicked || !canAddMore;

              return (
                <li
                  key={c.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => addOptional(c.id)}
                    disabled={disabled}
                    style={{
                      width: 28,
                      height: 28,
                      cursor: disabled ? "not-allowed" : "pointer",
                    }}
                    title={
                      isPicked
                        ? t.admin.liveSession.tooltips.alreadyPicked
                        : !canAddMore
                        ? t.admin.liveSession.tooltips.reachedLimit
                        : t.admin.liveSession.tooltips.add
                    }
                  >
                    +
                  </button>

                  <span style={{ opacity: isPicked ? 0.6 : 1 }}>
                    {c.name} {isPicked ? `(${t.admin.liveSession.picked})` : ""}
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
