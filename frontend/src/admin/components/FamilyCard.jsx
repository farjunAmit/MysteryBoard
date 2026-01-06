import CharacterCard from "./CharacterCard";
import "../styles/components/FamilyCard.css";

export default function FamilyCard({
  family,
  slots,
  events,
  onRevealTrait,
}) {
  const familySlots = slots.filter((slot) => {
    return (family.characters || []).some(
      (c) => String(c._id) === String(slot.characterId)
    );
  });

  if (!familySlots.length) return null;

  return (
    <div className="family-card">
      <div className="family-card__header">{family.name}</div>
      <div className="family-card__grid">
        {familySlots.map((slot) => {
          const character = (family.characters || []).find(
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
    </div>
  );
}
