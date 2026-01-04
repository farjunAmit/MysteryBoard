import OptionalCharactersList from "./OptionalCharactersList";
import { texts as t } from "../../texts";

const styles = {
  familiesContainer: {
    width: "100%",
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 12,
  },
  familySection: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 6,
  },
  familyTitle: {
    margin: "0 0 8px 0",
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  familySharedInfo: {
    margin: "0 0 8px 0",
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
};

export default function GroupsSection({ scenario, session, canAddMore, onAddCharacter }) {
  return (
    <div style={styles.familiesContainer}>
      <strong style={{ display: "block", marginBottom: 12 }}>
        {t.admin.liveSession.characters.optional}
      </strong>

      {(scenario.groups || []).map((group) => (
        <div key={group._id} style={styles.familySection}>
          <h4 style={styles.familyTitle}>{group.name}</h4>
          {group.sharedInfo && <p style={styles.familySharedInfo}>{group.sharedInfo}</p>}

          <OptionalCharactersList
            characters={group.characters}
            slots={session.slots}
            canAddMore={canAddMore}
            onAddCharacter={onAddCharacter}
          />
        </div>
      ))}
    </div>
  );
}
