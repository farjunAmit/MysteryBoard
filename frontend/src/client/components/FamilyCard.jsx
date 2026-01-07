import CharacterCard from "./CharacterCard";

const styles = {
  container: {
    marginBottom: "24px",
  },
  header: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "12px",
    paddingBottom: "8px",
    borderBottom: "2px solid #e5e7eb",
  },
  sharedInfo: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "12px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 12,
  },
};

export default function FamilyCard({
  family,
  characters,
  allCharacters,
  sessionId,
  isRevealedAtIndex,
}) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>{family.name}</div>
      {family.sharedInfo && (
        <div style={styles.sharedInfo}>{family.sharedInfo}</div>
      )}
      <div style={styles.grid}>
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
