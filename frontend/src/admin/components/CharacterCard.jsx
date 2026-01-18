import { useMemo, useState } from "react";
import { texts as t } from "../../texts";
import { API_BASE_URL } from "../../config/api";
import "../styles/components/AdminCharacterCard.css";

function getRevealedTraitsForCharacter(events, characterId) {
  return (events || [])
    .filter(
      (e) =>
        e.type === "trait_revealed" &&
        String(e.characterId) === String(characterId)
    )
    .map((e) => e.text);
}

export default function CharacterCard({
  character,
  slot,
  events,
  sessionId,
  hasPhoto,
  onRevealTrait,
}) {
  const [selectedTrait, setSelectedTrait] = useState("");

  const photoUrl = sessionId && hasPhoto && slot?.slotIndex !== undefined
    ? `${API_BASE_URL}/api/sessions/${sessionId}/slots/${slot.slotIndex}/photo`
    : null;

  const revealedTraits = useMemo(
    () => getRevealedTraitsForCharacter(events, character._id),
    [events, character._id]
  );

  const remainingTraits = useMemo(() => {
    const all = character?.traits || [];
    return all.filter((trait) => !revealedTraits.includes(trait));
  }, [character?.traits, revealedTraits]);

  return (
    <div className="character-card">
      <h3 className="character-card__name">{character.name}</h3>

      {photoUrl && (
        <img
          src={photoUrl}
          alt={character.name}
          className="character-card__photo"
        />
      )}

      <div className="character-card__section">
        <h4 className="character-card__section-title">
          {t.admin.characterCard.revealedTraits}
        </h4>

        {revealedTraits.length === 0 ? (
          <p className="character-card__empty-message">
            {t.admin.characterCard.noTraitsRevealed}
          </p>
        ) : (
          <ul className="character-card__traits-list">
            {revealedTraits.map((tr, idx) => (
              <li key={idx} className="character-card__trait-item">
                {tr}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="character-card__section">
        <select
          value={selectedTrait}
          onChange={(e) => setSelectedTrait(e.target.value)}
          disabled={remainingTraits.length === 0}
          className="character-card__select"
        >
          <option value="">
            {remainingTraits.length === 0
              ? t.admin.characterCard.noTraitsLeft
              : t.admin.characterCard.selectTraitPlaceholder}
          </option>

          {remainingTraits.map((tr) => (
            <option key={tr} value={tr}>
              {tr}
            </option>
          ))}
        </select>

        <button
          type="button"
          disabled={!selectedTrait || !onRevealTrait}
          onClick={() => {
            onRevealTrait?.(character._id, selectedTrait);
            setSelectedTrait("");
          }}
          className="character-card__button"
        >
          {t.admin.characterCard.reveal}
        </button>
      </div>
    </div>
  );
}
