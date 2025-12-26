import CharacterCard from "./CharacterCard";

export default function CharactersList({
  characters = [],
  slots = [],
  events = [],
  onRevealTrait,
}) {
  return (
    <div>
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
