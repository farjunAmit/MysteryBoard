import { texts as t } from "../../texts";
import "../styles/components/DesiredPlayersSelector.css";

export default function DesiredPlayersSelector({
  desiredPlayers,
  onDesiredPlayersChange,
  mandatoryCharsCount,
  optionalCharsCount,
  currentPlayers,
}) {
 // const maxPlayers = mandatoryCharsCount + optionalCharsCount;

  return (
    <div className="desired-players-selector">
      <strong className="desired-players-selector__label">{t.admin.liveSession.desiredPlayers.label}</strong>

      <select
        value={desiredPlayers}
        onChange={(e) => onDesiredPlayersChange(Number(e.target.value))}
        className="desired-players-selector__select"
      >
        {Array.from({ length: optionalCharsCount + 1 }, (_, i) => mandatoryCharsCount + i).map(
          (n) => (
            <option key={n} value={n}>
              {n}
            </option>
          )
        )}
      </select>

      <span className="desired-players-selector__info">
        {t.admin.liveSession.desiredPlayers.selected} {currentPlayers} / {desiredPlayers}
      </span>
    </div>
  );
}
