import { useState } from "react";
import CharacterForm from "./CharacterForm";
import { texts as t } from "../../texts";

export default function FamilyForm({
  familyIndex,
  family,
  onAddCharacter,
  onRemoveCharacter,
  onRemoveFamily,
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div style={styles.familyCard}>
      {/* Family header */}
      <div style={styles.familyHeader}>
        <div style={styles.familyInfo}>
          <h3 style={styles.familyName}>{family.name}</h3>
          {family.sharedInfo && (
            <p style={styles.sharedInfo}>{family.sharedInfo}</p>
          )}
        </div>
        <div style={styles.familyActions}>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            style={styles.expandButton}
          >
            {isExpanded ? "▼" : "▶"}
          </button>
          <button
            type="button"
            onClick={() => onRemoveFamily(familyIndex)}
            style={styles.deleteButton}
          >
            {t.common.actions.delete}
          </button>
        </div>
      </div>

      {/* Family content */}
      {isExpanded && (
        <div style={styles.familyContent}>
          {/* Add character form */}
          <CharacterForm onAdd={(char) => onAddCharacter(familyIndex, char)} />

          {/* Characters list */}
          {family.characters && family.characters.length > 0 && (
            <ul style={styles.charactersList}>
              {family.characters.map((c) => (
                <li key={c.id} style={styles.characterItem}>
                  <span>
                    {c.name}{" "}
                    {c.required
                      ? t.admin.scenarioForm.characterList.requiredTag
                      : ""}{" "}
                    — {c.traits.join(", ")}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveCharacter(familyIndex, c.id)}
                    style={styles.deleteCharButton}
                  >
                    {t.common.actions.delete}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {(!family.characters || family.characters.length === 0) && (
            <p style={styles.emptyMessage}>
              {t.admin.familyForm.noCharactersAdded}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  familyCard: {
    marginBottom: 12,
    border: "1px solid #ddd",
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#fafafa",
  },
  familyHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderBottom: "1px solid #ddd",
    cursor: "pointer",
  },
  familyInfo: {
    flex: 1,
  },
  familyName: {
    margin: "0 0 4px 0",
    fontSize: 16,
    fontWeight: "bold",
  },
  sharedInfo: {
    margin: 0,
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  familyActions: {
    display: "flex",
    gap: 8,
  },
  expandButton: {
    background: "none",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    padding: "4px 8px",
  },
  deleteButton: {
    padding: "6px 12px",
    borderRadius: 4,
    border: "none",
    backgroundColor: "#dc3545",
    color: "white",
    cursor: "pointer",
    fontSize: 12,
  },
  familyContent: {
    padding: 12,
  },
  charactersList: {
    listStyle: "none",
    margin: "12px 0 0 0",
    padding: 0,
  },
  characterItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    backgroundColor: "white",
    marginBottom: 6,
    borderRadius: 4,
    border: "1px solid #eee",
  },
  deleteCharButton: {
    padding: "4px 8px",
    borderRadius: 4,
    border: "none",
    backgroundColor: "#dc3545",
    color: "white",
    cursor: "pointer",
    fontSize: 11,
  },
  emptyMessage: {
    marginTop: 12,
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
};
