import { texts as t } from "../../texts";

export default function DesiredPlayersSelector({
  desiredPlayers,
  onDesiredPlayersChange,
  mandatoryCharsCount,
  optionalCharsCount,
  currentPlayers,
}) {
  const maxPlayers = mandatoryCharsCount + optionalCharsCount;

  return (
    <div style={{ marginBottom: 12, display: "flex", gap: 12, alignItems: "center" }}>
      <strong>{t.admin.liveSession.desiredPlayers.label}</strong>

      <select
        value={desiredPlayers}
        onChange={(e) => onDesiredPlayersChange(Number(e.target.value))}
      >
        {Array.from({ length: optionalCharsCount + 1 }, (_, i) => mandatoryCharsCount + i).map(
          (n) => (
            <option key={n} value={n}>
              {n}
            </option>
          )
        )}
      </select>

      <span style={{ opacity: 0.8 }}>
        {t.admin.liveSession.desiredPlayers.selected} {currentPlayers} / {desiredPlayers}
      </span>
    </div>
  );
}
