import { texts as t } from "../../texts";
import "../styles/components/SessionMetaInfo.css";

export default function SessionMetaInfo({ sessionName, phase, playerCount, slotsCount }) {
  return (
    <div className="session-meta-info">
      <div className="session-meta-info__card">
        <strong className="session-meta-info__label">{t.admin.liveSession.meta.sessionName}:</strong>
        <span className="session-meta-info__value">{sessionName}</span>
      </div>
      <div className="session-meta-info__card">
        <strong className="session-meta-info__label">{t.admin.liveSession.meta.phase}:</strong>
        <span className="session-meta-info__value">{phase}</span>
      </div>
      <div className="session-meta-info__card">
        <strong className="session-meta-info__label">{t.admin.liveSession.meta.players}:</strong>
        <span className="session-meta-info__value">{playerCount}</span>
      </div>
      <div className="session-meta-info__card">
        <strong className="session-meta-info__label">{t.admin.liveSession.meta.slots}:</strong>
        <span className="session-meta-info__value">{slotsCount}</span>
      </div>
    </div>
  );
}
