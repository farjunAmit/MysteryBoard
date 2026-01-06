import { useMemo } from "react";
import { adminTheme, createAdminStyles } from "../ui/adminTheme";
import { texts as t } from "../../texts";

export default function OptionalCharactersList({
  characters,
  slots,
  canAddMore,
  onAddCharacter,
}) {
  const theme = adminTheme;
  const styles = useMemo(() => createAdminStyles(theme), []);

  return (
    <ul style={optionalStyles.list}>
      {(characters || [])
        .filter((c) => !c.required)
        .map((c) => {
          const isPicked = (slots || []).some(
            (s) => String(s.characterId) === String(c._id)
          );
          const disabled = isPicked || !canAddMore;

          return (
            <li key={c._id} style={optionalStyles.item}>
              <button
                type="button"
                onClick={() => onAddCharacter(c._id)}
                disabled={disabled}
                style={{
                  ...optionalStyles.addButton,
                  opacity: disabled ? 0.5 : 1,
                  cursor: disabled ? "not-allowed" : "pointer",
                }}
                title={
                  isPicked
                    ? t.admin.liveSession.tooltips.alreadyPicked
                    : !canAddMore
                    ? t.admin.liveSession.tooltips.reachedLimit
                    : t.admin.liveSession.tooltips.add
                }
              >
                +
              </button>

              <span
                style={{
                  ...optionalStyles.characterName,
                  opacity: isPicked ? 0.6 : 1,
                }}
              >
                {c.name} {isPicked ? `(${t.admin.liveSession.picked})` : ""}
              </span>
            </li>
          );
        })}
    </ul>
  );
}

const optionalStyles = {
  list: {
    listStyle: "none",
    margin: "8px 0",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  addButton: {
    width: 28,
    height: 28,
    minWidth: 28,
    padding: 0,
    borderRadius: 10,
    border: "1px solid #C9A24D",
    backgroundColor: "#C9A24D",
    color: "#0B0F14",
    fontWeight: 800,
    fontSize: 16,
  },
  characterName: {
    color: "#EDEDED",
    fontSize: 13,
  },
};