import OptionalCharactersList from "./OptionalCharactersList";
import { texts as t } from "../../texts";

const styles = {
  characterSection: {
    flex: 1,
    minWidth: 240,
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 12,
  },
};

export default function CharacterSection({ scenario, session, canAddMore, onAddCharacter }) {
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
      <div style={styles.characterSection}>
        <strong>{t.admin.liveSession.characters.mandatory}</strong>
        <ul>
          {(scenario.characters || [])
            .filter((c) => c.required)
            .map((c) => (
              <li key={c._id}>{c.name}</li>
            ))}
        </ul>
      </div>

      <div style={styles.characterSection}>
        <strong>{t.admin.liveSession.characters.optional}</strong>
        <OptionalCharactersList
          characters={scenario.characters}
          slots={session.slots}
          canAddMore={canAddMore}
          onAddCharacter={onAddCharacter}
        />
      </div>
    </div>
  );
}
