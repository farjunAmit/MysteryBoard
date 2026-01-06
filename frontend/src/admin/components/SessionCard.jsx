import { texts as t } from "../../texts";
import "../styles/components/SessionCard.css";

export default function SessionCard({
  session,
  scenario,
  theme,
  onGoToSession,
  onDeleteSession,
}) {
  return (
    <div className="session-card">
      <div className="session-card__image-container">
        {scenario?.imageUrl ? (
          <img
            src={scenario.imageUrl}
            alt={scenario?.name}
            className="session-card__image"
          />
        ) : (
          <div className="session-card__no-image">No Photo</div>
        )}
      </div>

      <div className="session-card__content">
        <h3 className="session-card__title">{scenario?.name || "Loading..."}</h3>

        <div className="session-card__phase-section">
          <span className="session-card__phase-label">Phase:</span>
          <span className="session-card__phase-value">{session.phase}</span>
        </div>

        <div className="session-card__button-group">
          <button
            onClick={() => onGoToSession(session)}
            className="session-card__button session-card__button-primary"
          >
            {t.common.actions.go || "Go to Session"}
          </button>
          <button
            onClick={() => onDeleteSession(session.id)}
            className="session-card__button session-card__button-danger"
          >
            {t.common.actions.delete || "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}