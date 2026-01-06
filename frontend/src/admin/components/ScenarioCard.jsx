import "../styles/components/ScenarioCard.css";

export default function ScenarioCard({ scenario, onStartLive, onDelete }) {
  const playersText =
    scenario.minPlayers || scenario.maxPlayers
      ? `Players: ${scenario.minPlayers ?? "?"}–${scenario.maxPlayers ?? "?"}`
      : null;

  return (
    <div className="scenario-card">
      {/* Image */}
      {scenario.imageUrl ? (
        <div className="scenario-card__image-wrapper">
          <img
            src={scenario.imageUrl}
            alt={scenario.name}
            className="scenario-card__image"
          />
          <div className="scenario-card__image-overlay" />
        </div>
      ) : (
        <div className="scenario-card__no-image">
          No image
        </div>
      )}

      <div className="scenario-card__content">
        {/* Title */}
        <div className="scenario-card__title">
          {scenario.name}
        </div>

        {/* Players */}
        {playersText && (
          <div className="scenario-card__players">
            <span className="scenario-card__players-badge">
              {playersText}
            </span>
          </div>
        )}

        {/* Description */}
        <div className="scenario-card__description">
          {scenario.description?.trim() ? scenario.description : "No description"}
        </div>

        {/* Actions */}
        <div className="scenario-card__actions">
          <button
            type="button"
            onClick={() => onStartLive(scenario.id)}
            className="scenario-card__button scenario-card__button-start"
          >
            Start Live
          </button>

          <button
            type="button"
            onClick={() => onDelete(scenario.id)}
            className="scenario-card__button-delete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
