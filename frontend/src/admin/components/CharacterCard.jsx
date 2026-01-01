import { useMemo, useState } from "react";
import { texts as t } from "../../texts";

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
  onRevealTrait,
}) {
  const [selectedTrait, setSelectedTrait] = useState("");

  const revealedTraits = useMemo(
    () => getRevealedTraitsForCharacter(events, character._id),
    [events, character._id]
  );

  const remainingTraits = useMemo(() => {
    const all = character?.traits || [];
    return all.filter((trait) => !revealedTraits.includes(trait));
  }, [character?.traits, revealedTraits]);

  return (
    <div>
      <h3>{character.name}</h3>

      {slot?.photoUrl && <img src={slot.photoUrl} alt={character.name} />}

      <h4>{t.admin.characterCard.revealedTraits}</h4>

      {revealedTraits.length === 0 ? (
        <p>{t.admin.characterCard.noTraitsRevealed}</p>
      ) : (
        <ul>
          {revealedTraits.map((tr, idx) => (
            <li key={idx}>{tr}</li>
          ))}
        </ul>
      )}

      <select
        value={selectedTrait}
        onChange={(e) => setSelectedTrait(e.target.value)}
        disabled={remainingTraits.length === 0}
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
      >
        {t.admin.characterCard.reveal}
      </button>
    </div>
  );
}
