import { useMemo } from "react";
import { useParams } from "react-router-dom";
import CharactersGrid from "../components/CharactersGrid";
import { useClientSession } from "../hook/useClientSession";
import { texts as t } from "../../texts";
import { ClientSessionsApi } from "../../api/clientSessions.api";
import "../styles/pages/ClientScreenWantedBoard.css";

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
      className="client-screen"
    >
      <div className="client-screen__header">
        <div>
          <h2 className="client-screen__title">
            {data.title ?? t.client.screen.defaultTitle}
          </h2>

          <div className="client-screen__meta">
            <span className="client-screen__meta-item">
              <span className="client-screen__meta-label">{t.client.screen.modeLabel}</span>{" "}
              <span className="client-screen__meta-value">{revealMode}</span>
            </span>
            <span className="client-screen__meta-item">
              <span className="client-screen__meta-label">{t.client.screen.revealedLabel}</span>{" "}
              <span className="client-screen__meta-value">{revealedCount}</span> /
              <span className="client-screen__meta-value"> {characters.length}</span>
            </span>
            <span className="client-screen__meta-item">
              <span className="client-screen__meta-label">phase:</span>{" "}
              <span className="client-screen__meta-value">{data.phase}</span>
            </span>
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

      <div className="client-screen__message">
        {latestChat && (
          <>
            <div className="client-screen__message-label">
              {t.client.screen.message || "Message"}
            </div>
            <div className="client-screen__message-text">{latestChat.text}</div>
          </>
        )}
      </div>
    </div>
  );
}
