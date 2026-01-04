import CharacterCard from "./CharacterCard";
import FamilyCard from "./FamilyCard";

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 12,
  },
};

export default function CharactersGrid({
  characters,
  families = [],
  scenarioMode = "characters",
  isRevealedAtIndex,
}) {
  // Standard mode: flat layout
  if (scenarioMode === "characters") {
    return (
      <div style={styles.grid}>
        {characters.map((c, idx) => (
          <CharacterCard
            key={c.id}
            character={c}
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
              isRevealedAtIndex={isRevealedAtIndex}
            />
          );
        })}
      </div>
    );
  }

  return null;
}
