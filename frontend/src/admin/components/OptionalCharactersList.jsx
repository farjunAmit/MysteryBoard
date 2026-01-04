import { texts as t } from "../../texts";

export default function OptionalCharactersList({
  characters,
  slots,
  canAddMore,
  onAddCharacter,
}) {
  return (
    <ul style={{ paddingInlineStart: 18, margin: "8px 0" }}>
      {(characters || [])
        .filter((c) => !c.required)
        .map((c) => {
          const isPicked = (slots || []).some(
            (s) => String(s.characterId) === String(c._id)
          );
          const disabled = isPicked || !canAddMore;

          return (
            <li
              key={c._id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <button
                type="button"
                onClick={() => onAddCharacter(c._id)}
                disabled={disabled}
                style={{
                  width: 28,
                  height: 28,
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

              <span style={{ opacity: isPicked ? 0.6 : 1 }}>
                {c.name} {isPicked ? `(${t.admin.liveSession.picked})` : ""}
              </span>
            </li>
          );
        })}
    </ul>
  );
}