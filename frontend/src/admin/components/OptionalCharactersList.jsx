import { texts as t } from "../../texts";
import "../styles/components/OptionalCharactersList.css";

export default function OptionalCharactersList({
  characters,
  slots,
  canAddMore,
  onAddCharacter,
}) {
  return (
    <ul className="optional-characters-list">
      {(characters || [])
        .filter((c) => !c.required)
        .map((c) => {
          const isPicked = (slots || []).some(
            (s) => String(s.characterId) === String(c._id)
          );
          const disabled = isPicked || !canAddMore;

          return (
            <li key={c._id} className="optional-characters-list__item">
              <button
                type="button"
                onClick={() => onAddCharacter(c._id)}
                disabled={disabled}
                className="optional-characters-list__button"
                style={{ opacity: disabled ? 0.5 : 1 }}
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
                className={`optional-characters-list__name ${
                  isPicked ? "optional-characters-list__name--picked" : ""
                }`}
              >
                {c.name} {isPicked ? `(${t.admin.liveSession.picked})` : ""}
              </span>
            </li>
          );
        })}
    </ul>
  );
}