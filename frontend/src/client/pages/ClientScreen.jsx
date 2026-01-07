import { useMemo } from "react";
import { useParams } from "react-router-dom";
import CharactersGrid from "../components/CharactersGrid";
import { useClientSession } from "../hook/useClientSession";
import { texts as t } from "../../texts";
import { ClientSessionsApi } from "../../api/clientSessions.api";

export default function ClientScreen() {
  const { sessionId } = useParams();
  const { data, loading, error } = useClientSession(sessionId, {
    pollMs: 1500,
  });

  const characters = data?.characters ?? [];
  const families = data?.families ?? [];
  const scenarioMode = data?.scenarioMode ?? "characters";
  const revealMode = (data?.reveal?.mode ?? "slow").toLowerCase();
  const revealedCount = data?.reveal?.revealedCount ?? 0;
  const latestChat = data?.latestChat;

  const handleScreenClick = async () => {
    if (!data) return;
    if (data.phase !== "reveal") return;
    if (revealMode !== "slow") return;

    await ClientSessionsApi.revealNext(sessionId);
  };

  const isRevealedAtIndex = useMemo(
    () => (idx) => idx < revealedCount,
    [revealedCount]
  );

  if (error)
    return (
      <div style={{ padding: 16 }}>
        {t.client.screen.errorPrefix} {error}
      </div>
    );

  if (!data && loading)
    return <div style={{ padding: 16 }}>{t.client.screen.loading}</div>;

  if (!data)
    return <div style={{ padding: 16 }}>{t.client.screen.notFound}</div>;

  return (
    <div
      onClick={handleScreenClick}
      style={{ padding: 16, maxWidth: 1100, margin: "0 auto" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 14,
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>
            {data.title ?? t.client.screen.defaultTitle}
          </h2>

          <div style={{ color: "#6b7280", fontSize: 13 }}>
            {t.client.screen.modeLabel} <b>{revealMode}</b> •{" "}
            {t.client.screen.revealedLabel} <b>{revealedCount}</b> /{" "}
            <b>{characters.length}</b>
            {"  "}• phase: <b>{data.phase}</b>
          </div>
        </div>
      </div>

      <CharactersGrid
        sessionId={sessionId}
        characters={characters}
        families={families}
        scenarioMode={scenarioMode}
        isRevealedAtIndex={isRevealedAtIndex}
      />

      {latestChat && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            border: "1px solid #e5e7eb",
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
            Message
          </div>
          <div style={{ fontSize: 16 }}>{latestChat.text}</div>
        </div>
      )}
    </div>
  );
}
