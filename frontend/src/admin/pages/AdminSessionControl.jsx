import { useEffect, useState } from "react";
import { SessionsApi } from "../../api/sessions.api";
import { useParams, useNavigate } from "react-router-dom";
import CharactersList from "../components/CharactersList";
import SessionChat from "../components/SessionChat"

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
        if (!cancelled) setError(e.message || "Failed to load session");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    // Do nothing if session is not loaded yet
    if (!session?._id) return;

    // Poll only while in the "reveal" phase
    if (session.phase !== "reveal") return;

    let cancelled = false;

    const intervalId = setInterval(async () => {
      try {
        // Lightweight fetch – we only need the updated session state
        const updatedSession = await SessionsApi.getById(session._id);

        // Avoid state updates after unmount / cleanup
        if (!cancelled) {
          setSession(updatedSession);
        }
      } catch (err) {
        console.error("Session polling failed:", err);
      }
    }, 1500); // Poll every 1.5 seconds

    // Cleanup when leaving the reveal phase or unmounting the component
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [session?._id, session?.phase]);

  if (!session || !scenario) {
    return <div style={{ padding: 16 }}>{error ? error : "Loading…"}</div>;
  }

  async function handleRevealTrait(characterId, traitText) {
    try {
      const updatedSession = await SessionsApi.revealTrait(
        session._id,
        characterId,
        traitText
      );
      setSession(updatedSession);
    } catch (e) {
      console.error(e);
      alert(e.message || "Failed to send trait");
    }
  }

  async function handleSendMessage(text) {
    try {
      const updatedSession = await SessionsApi.addChat(session._id, text);
      setSession(updatedSession);
    } catch (e) {
      console.error(e);
      alert(e.message || "Failed to send message");
    }
  }

  return (
    <div style={{ padding: 16, direction: "rtl", fontFamily: "sans-serif" }}>
      <h2>Game Control</h2>
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
    </div>
  );
}
