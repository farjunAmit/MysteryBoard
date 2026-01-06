import { useEffect, useState } from "react";
import { SessionsApi } from "../../api/sessions.api";
import { useParams, useNavigate } from "react-router-dom";
import CharactersList from "../components/CharactersList";
import SessionChat from "../components/SessionChat";
import { texts as t } from "../../texts";
import "../styles/pages/shared.css";
import "../styles/components/JoinCodeBox.css";

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
        if (!cancelled)
          setError(e?.message || t.admin.sessionControl.errors.load);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!session?.id) return;
    if (session.phase !== "reveal") return;

    let cancelled = false;

    const intervalId = setInterval(async () => {
      try {
        const updatedSession = await SessionsApi.getById(session.id);

        if (!cancelled) {
          setSession(updatedSession);
        }
      } catch (err) {
        console.error("Session polling failed:", err);
      }
    }, 1500);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [session?.id, session?.phase]);

  if (!session || !scenario) {
    return (
      <div className="page">
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

  async function handleClearMessage() {
    try {
      const updatedSession = await SessionsApi.clearChat(session.id);
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
    <div className="page">
      <div className="header">
        <h1 className="title">{t.admin.sessionControl.title}</h1>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="join-code-box">
        <strong className="join-code-box__label">
          {t.admin.sessionControl.labels.joinCode}:
        </strong>
        <span className="join-code-box__value">
          {session?.joinCode || t.admin.sessionControl.labels.joinCodeMissing}
        </span>
      </div>

      <CharactersList
        scenario={scenario}
        characters={scenario.mode === "groups" ? [] : scenario.characters}
        groups={scenario.mode === "groups" ? scenario.groups : []}
        slots={session.slots}
        events={session.events}
        scenarioMode={scenario.mode}
        onRevealTrait={canRevealTraits ? handleRevealTrait : undefined}
      />

      <SessionChat
        disabled={session.phase !== "running"}
        onSend={handleSendMessage}
        onClear={handleClearMessage}
      />

      {session.phase === "running" && (
        <button
          type="button"
          onClick={handleEndSession}
          className="join-code-box__end-button"
        >
          {t.admin.sessionControl.actions.endSession}
        </button>
      )}
    </div>
  );
}