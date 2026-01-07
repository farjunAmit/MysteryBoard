import CharacterCard from "./CharacterCard";
import "../styles/components/FamilyCard.css";

export default function FamilyCard({
  family,
  slots,
  events,
  sessionId,
  photoStatus,
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
          const hasPhoto = photoStatus?.haveSlotIndexes?.includes(slot.slotIndex) ?? false;
          if (!character) return null;

          return (
            <CharacterCard
              key={String(slot.characterId)}
              character={character}
              slot={slot}
              events={events}
              sessionId={sessionId}
              hasPhoto={hasPhoto}
              onRevealTrait={onRevealTrait}
            />
          );
        })}
      </div>
    </div>
  );
}
