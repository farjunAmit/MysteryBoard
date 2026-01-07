import CharacterCard from "./CharacterCard";
import "../styles/components/FamilyCard.css";

export default function FamilyCard({
  family,
  characters,
  allCharacters,
  sessionId,
  isRevealedAtIndex,
}) {
  return (
    <div className="family-card">
      <div className="family-card__header">{family.name}</div>
      {family.sharedInfo && (
        <div className="family-card__shared-info">{family.sharedInfo}</div>
      )}
      <div className="family-card__grid">
        {characters.map((c) => {
          const charIndex = allCharacters.indexOf(c);
          return (
            <CharacterCard
              key={c.id}
              character={c}
              sessionId={sessionId}
              slotIndex={charIndex}
              isRevealed={isRevealedAtIndex(charIndex)}
            />
          );
        })}
      </div>
    </div>
  );
}
