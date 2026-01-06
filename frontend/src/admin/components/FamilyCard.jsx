import CharacterCard from "./CharacterCard";

const styles = {
  container: {
    marginBottom: 24,
  },
  header: {
    fontSize: 18,
    fontWeight: 800,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: "2px solid #1F3448",
    color: "#EDEDED",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 16,
  },
};

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
    <div style={styles.container}>
      <div style={styles.header}>{family.name}</div>
      <div style={styles.grid}>
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
