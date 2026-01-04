import { texts as t } from "../../texts";
import CharacterCard from "./CharacterCard";

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },
  familyContainer: {
    marginBottom: "24px",
  },
  familyHeader: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "12px",
    paddingBottom: "8px",
    borderBottom: "2px solid #e5e7eb",
  },
  familyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },
};

export default function CharactersList({
  scenario,
  characters = [],
  groups = [],
  slots = [],
  events = [],
  scenarioMode = "characters",
  onRevealTrait,
}) {
  if (!slots.length) {
    return <p>{t.admin.charactersList.empty}</p>;
  }

  // Standard mode: flat layout
  if (scenarioMode === "characters") {
    return (
      <div style={styles.grid}>
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

  // Family mode: grouped by family
  if (scenarioMode === "groups") {
    return (
      <div>
        {groups.map((group) => {
          const familySlots = slots.filter((slot) => {
            // Find if this slot's character is in this group
            return (group.characters || []).some(
              (c) => String(c._id) === String(slot.characterId)
            );
          });

          if (!familySlots.length) return null;

          return (
            <div key={group._id} style={styles.familyContainer}>
              <div style={styles.familyHeader}>{group.name}</div>
              <div style={styles.familyGrid}>
                {familySlots.map((slot) => {
                  const character = (group.characters || []).find(
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
        })}
      </div>
    );
  }

  return null;
}
