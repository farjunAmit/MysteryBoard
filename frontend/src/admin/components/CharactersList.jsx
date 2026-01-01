import { texts as t } from "../../texts";
import CharacterCard from "./CharacterCard";

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "16px",
};

export default function CharactersList({
  characters = [],
  slots = [],
  events = [],
  onRevealTrait,
}) {
  if (!slots.length) {
    return <p>{t.admin.charactersList.empty}</p>;
  }

  return (
    <div style={gridStyle}>
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
