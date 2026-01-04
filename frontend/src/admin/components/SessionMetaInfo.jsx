import { texts as t } from "../../texts";

export default function SessionMetaInfo({ sessionId, phase, playerCount, slotsCount }) {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
      <div style={{ padding: 8, border: "1px solid #ddd", borderRadius: 8 }}>
        <strong>{t.admin.liveSession.meta.sessionId}:</strong> {sessionId}
      </div>
      <div style={{ padding: 8, border: "1px solid #ddd", borderRadius: 8 }}>
        <strong>{t.admin.liveSession.meta.phase}:</strong> {phase}
      </div>
      <div style={{ padding: 8, border: "1px solid #ddd", borderRadius: 8 }}>
        <strong>{t.admin.liveSession.meta.players}:</strong> {playerCount}
      </div>
      <div style={{ padding: 8, border: "1px solid #ddd", borderRadius: 8 }}>
        <strong>{t.admin.liveSession.meta.slots}:</strong> {slotsCount}
      </div>
    </div>
  );
}
