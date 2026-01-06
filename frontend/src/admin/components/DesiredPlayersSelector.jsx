import { useMemo } from "react";
import { adminTheme, createAdminStyles } from "../ui/adminTheme";
import { texts as t } from "../../texts";

export default function DesiredPlayersSelector({
  desiredPlayers,
  onDesiredPlayersChange,
  mandatoryCharsCount,
  optionalCharsCount,
  currentPlayers,
}) {
  const theme = adminTheme;
  const styles = useMemo(() => createAdminStyles(theme), []);

  const maxPlayers = mandatoryCharsCount + optionalCharsCount;

  return (
    <div style={desiredStyles.container}>
      <strong style={desiredStyles.label}>{t.admin.liveSession.desiredPlayers.label}</strong>

      <select
        value={desiredPlayers}
        onChange={(e) => onDesiredPlayersChange(Number(e.target.value))}
        style={desiredStyles.select}
      >
        {Array.from({ length: optionalCharsCount + 1 }, (_, i) => mandatoryCharsCount + i).map(
          (n) => (
            <option key={n} value={n}>
              {n}
            </option>
          )
        )}
      </select>

      <span style={desiredStyles.info}>
        {t.admin.liveSession.desiredPlayers.selected} {currentPlayers} / {desiredPlayers}
      </span>
    </div>
  );
}

const desiredStyles = {
  container: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 16,
    padding: 14,
    border: "1px solid #1F3448",
    borderRadius: 12,
    backgroundColor: "#162635",
  },
  label: {
    color: "#B8B8B8",
    fontSize: 13,
    fontWeight: 700,
  },
  select: {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #1F3448",
    backgroundColor: "#13212E",
    color: "#EDEDED",
    fontSize: 13,
    cursor: "pointer",
  },
  info: {
    color: "#B8B8B8",
    fontSize: 13,
  },
};
