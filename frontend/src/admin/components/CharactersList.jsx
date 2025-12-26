import CharacterCard from "./CharacterCard";

export default function CharactersList({
  characters = [],
  slots = [],
  events = [],
  onRevealTrait,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
      }}
    >
      {slots.map((slot) => {
        const character = characters.find(
          (c) => String(c._id) === String(slot.characterId)
        );
        if (!character) return null;

        return (
          <CharacterCard
            key={String(slot.characterId)}
            character={character}
            slot={slot}
            events={events}
            onRevealTrait={onRevealTrait}
          />
        );
      })}
    </div>
  );
}
