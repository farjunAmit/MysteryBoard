// src/pages/AdminLiveSession.jsx
import { useEffect, useMemo, useState } from "react";
import { SessionsApi } from "../../api/sessions.api";
import { useParams, useNavigate } from "react-router-dom";
import { texts as t } from "../../texts";
import SessionMetaInfo from "../components/SessionMetaInfo";
import PlayModeSelector from "../components/PlayModeSelector";
import DesiredPlayersSelector from "../components/DesiredPlayersSelector";
import SlotsSection from "../components/SlotsSection";
import CharacterSection from "../components/CharacterSection";
import GroupsSection from "../components/GroupsSection";
import "../styles/pages/shared.css";

export default function AdminLiveSession() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [desiredPlayers, setDesiredPlayers] = useState(0);
  const [mode, setMode] = useState("slow");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [photoStatus, setPhotoStatus] = useState(null);
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
          const status = await SessionsApi.getPhotoStatus(
            data.session._id || data.session.id
          );
          setPhotoStatus(status);
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
    return <div className="page">{t.common.status.loading}</div>;
  }

  let mandatoryChars = [];
  let optionalChars = [];

  if (scenario.mode === "characters") {
    const chars = scenario.characters || [];
    mandatoryChars = chars.filter((c) => c.required);
    optionalChars = chars.filter((c) => !c.required);
  } else if (scenario.mode === "groups") {
    (scenario.groups || []).forEach((group) => {
      const mandatory = (group.characters || []).filter((c) => c.required);
      const optional = (group.characters || []).filter((c) => !c.required);
      mandatoryChars.push(...mandatory);
      optionalChars.push(...optional);
    });
  }

  const currentPlayers = session.slots?.length ?? 0;
  const canAddMore = currentPlayers < desiredPlayers;
  const allPhotosPresent = Boolean(photoStatus?.allPresent);

  async function addOptional(characterId) {
    try {
      setError("");
      const updated = await SessionsApi.addSlot(sessionId, characterId);
      setSession(updated);
    } catch (e) {
      setError(e?.message || t.admin.liveSession.errors.addCharacter);
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

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        setBusy(true);
        setError("");
        await SessionsApi.uploadSlotPhoto(sessionId, slot.slotIndex, file);
        const status = await SessionsApi.getPhotoStatus(sessionId);
        setPhotoStatus(status);
      } catch (err) {
        setError(err?.message || t.admin.liveSession.errors.savePhoto);
      } finally {
        setBusy(false);
      }
    };

    input.click();
  }

  return (
    <div className="page">
      <div className="header">
        <h1 className="title">{t.admin.liveSession.title}</h1>
      </div>

      {error && <div className="error">{error}</div>}

      <SessionMetaInfo
        sessionName={scenario.name}
        phase={session.phase}
        playerCount={session.playerCount}
        slotsCount={session.slots?.length ?? 0}
      />

      {session.phase === "setup" && (
        <PlayModeSelector
          mode={mode}
          onModeChange={setMode}
          onStart={startSession}
          disabled={session.phase !== "setup"}
          allPhotosPresent={allPhotosPresent}
          busy={busy}
        />
      )}

      <DesiredPlayersSelector
        desiredPlayers={desiredPlayers}
        onDesiredPlayersChange={setDesiredPlayers}
        mandatoryCharsCount={mandatoryChars.length}
        optionalCharsCount={optionalChars.length}
        currentPlayers={currentPlayers}
      />

      <SlotsSection
        session={session}
        scenario={scenario}
        busy={busy}
        photoStatus={photoStatus}
        onSetPhoto={handleSetPhoto}
      />

      {scenario.mode === "characters" && (
        <CharacterSection
          scenario={scenario}
          session={session}
          canAddMore={canAddMore}
          onAddCharacter={addOptional}
        />
      )}

      {scenario.mode === "groups" && (
        <GroupsSection
          scenario={scenario}
          session={session}
          canAddMore={canAddMore}
          onAddCharacter={addOptional}
        />
      )}
    </div>
  );
}
