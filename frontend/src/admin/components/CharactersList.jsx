import { texts as t } from "../../texts";
import CharacterCard from "./CharacterCard";
import FamilyCard from "./FamilyCard";

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 16,
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
        {groups.map((group) => (
          <FamilyCard
            key={group._id}
            family={group}
            slots={slots}
            events={events}
            onRevealTrait={onRevealTrait}
          />
        ))}
      </div>
    );
  }

  return null;
}
