import CharacterCard from "./CharacterCard";
import FamilyCard from "./FamilyCard";
import "../styles/components/CharactersGrid.css";

export default function CharactersGrid({
  sessionId,
  characters,
  families = [],
  scenarioMode = "characters",
  isRevealedAtIndex,
}) {
  // Standard mode: flat layout
  if (scenarioMode === "characters") {
    return (
      <div className="characters-grid">
        {characters.map((c, idx) => (
          <CharacterCard
            key={c.id}
            character={c}
            sessionId={sessionId}
            slotIndex={idx}
            isRevealed={isRevealedAtIndex(idx)}
          />
        ))}
      </div>
    );
  }

  // Family mode: grouped by family
  if (scenarioMode === "groups") {
    return (
      <div>
        {families.map((family) => {
          const familyCharacters = characters.filter(
            (c) => c.familyId === family.id
          );

          return (
            <FamilyCard
              key={family.id}
              family={family}
              characters={familyCharacters}
              allCharacters={characters}
              sessionId={sessionId}
              isRevealedAtIndex={isRevealedAtIndex}
            />
          );
        })}
      </div>
    );
  }

  return null;
}
