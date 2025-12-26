import { useState } from "react";

export default function CharacterCard({
  character,
  slot,
  events,
  onRevealTrait,
}) {
  const [selectedTrait, setSelectedTrait] = useState("");
  const revealedTraits = getRevealedTraitsForCharacter(events, character._id);
  const remainingTraits = character.traits.filter(
    (trait) => !revealedTraits.includes(trait)
  );

  function getRevealedTraitsForCharacter(events, characterId) {
    return (events || [])
      .filter(
        (e) =>
          e.type === "trait_revealed" &&
          String(e.characterId) === String(characterId)
      )
      .map((e) => e.text);
  }

  return (
    <div>
      <h3>{character.name}</h3>

      {slot?.photoUrl && <img src={slot.photoUrl} alt={character.name} />}

      <h4>Revealed</h4>
      <ul>
        {revealedTraits.map((t, idx) => (
          <li key={idx}>{t}</li>
        ))}
      </ul>

      <select
        value={selectedTrait}
        onChange={(e) => setSelectedTrait(e.target.value)}
      >
        <option value="">בחר תכונה לחשיפה...</option>
        {remainingTraits.map((t) => (
          <option key={t} value={t}>
            {t}
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
        Reveal
      </button>
    </div>
  );
}
