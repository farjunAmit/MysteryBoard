import { useEffect, useState } from "react";
import { SessionsApi } from "../../api/sessions.api";
import { useParams, useNavigate } from "react-router-dom";
import CharactersList from "../components/CharactersList";
import SessionChat from "../components/SessionChat";
import { texts as t } from "../../texts";

export default function AdminSessionControl() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const canRevealTraits = session?.phase === "running";

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
        if (!cancelled) setError(e?.message || t.admin.sessionControl.errors.load);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    // Do nothing if session is not loaded yet
    if (!session?.id) return;

    // Poll only while in the "reveal" phase
    if (session.phase !== "reveal") return;

    let cancelled = false;

    const intervalId = setInterval(async () => {
      try {
        // Lightweight fetch – we only need the updated session state
        const updatedSession = await SessionsApi.getById(session.id);

        // Avoid state updates after unmount / cleanup
        if (!cancelled) {
          setSession(updatedSession);
        }
      } catch (err) {
        console.error("Session polling failed:", err);
      }
    }, 1500);

    // Cleanup when leaving the reveal phase or unmounting the component
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [session?.id, session?.phase]);

  if (!session || !scenario) {
    return (
      <div style={{ padding: 16 }}>
        {error ? error : t.common.status.loading}
      </div>
    );
  }

  async function handleRevealTrait(characterId, traitText) {
    try {
      const updatedSession = await SessionsApi.revealTrait(
        session.id,
        characterId,
        traitText
      );
      setSession(updatedSession);
    } catch (e) {
      console.error(e);
      alert(e?.message || t.admin.sessionControl.errors.sendTrait);
    }
  }

  async function handleSendMessage(text) {
    try {
      const updatedSession = await SessionsApi.addChat(session.id, text);
      setSession(updatedSession);
    } catch (e) {
      console.error(e);
      alert(e?.message || t.admin.sessionControl.errors.sendMessage);
    }
  }

  async function handleEndSession() {
    try {
      await SessionsApi.end(session.id);
      await SessionsApi.delete(session.id);
      navigate("/admin");
    } catch (e) {
      console.error(e);
      alert(e?.message || t.admin.sessionControl.errors.endSession);
    }
  }

  return (
    <div style={{ padding: 16, fontFamily: "sans-serif" }}>
      <h2>{t.admin.sessionControl.title}</h2>

      <div
        style={{
          position: "fixed",
          top: 12,
          left: 12,
          padding: "6px 10px",
          border: "1px solid #444",
          background: "#111",
          color: "#fff",
          zIndex: 1000,
          fontSize: 14,
        }}
      >
        {t.admin.sessionControl.labels.joinCode}:{" "}
        <b>{session?.joinCode || t.admin.sessionControl.labels.joinCodeMissing}</b>
      </div>

      <CharactersList
        characters={scenario.characters}
        slots={session.slots}
        events={session.events}
        onRevealTrait={canRevealTraits ? handleRevealTrait : undefined}
      />

      <SessionChat
        disabled={session.phase !== "running"}
        onSend={handleSendMessage}
      />

      {session.phase === "running" && (
        <button type="button" onClick={handleEndSession}>
          {t.admin.sessionControl.actions.endSession}
        </button>
      )}
    </div>
  );
}
