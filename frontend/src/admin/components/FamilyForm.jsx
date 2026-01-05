import { useState } from "react";
import CharacterForm from "./CharacterForm";
import CharacterListForForms from "./CharacterListForForms";
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
      {/* Header */}
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
            onClick={() => setIsExpanded((v) => !v)}
            style={styles.expandButton}
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? "▾" : "▸"}
          </button>

          <button
            type="button"
            onClick={() => onRemoveFamily(familyIndex)}
            style={styles.deleteButton}
            title={t.common.actions.delete}
          >
            {t.common.actions.delete}
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div style={styles.familyContent}>
          {/* Add character */}
          <CharacterForm onAdd={(char) => onAddCharacter(familyIndex, char)} />

          {/* Characters list */}
          <CharacterListForForms
            characters={family.characters}
            onRemove={(charId) => onRemoveCharacter(familyIndex, charId)}
          />
        </div>
      )}
    </div>
  );
}

const styles = {
  familyCard: {
    marginBottom: 14,
    borderRadius: 14,
    border: "1px solid #1F3448",
    backgroundColor: "#162635",
    overflow: "hidden",
  },
  familyHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    padding: 14,
    backgroundColor: "#13212E",
    borderBottom: "1px solid #1F3448",
  },
  familyInfo: { flex: 1, minWidth: 0 },
  familyName: {
    margin: 0,
    fontSize: 16,
    fontWeight: 800,
    color: "#EDEDED",
  },
  sharedInfo: {
    margin: "6px 0 0 0",
    fontSize: 12,
    color: "#B8B8B8",
    fontStyle: "italic",
  },
  familyActions: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  expandButton: {
    background: "transparent",
    border: "1px solid #1F3448",
    color: "#EDEDED",
    borderRadius: 10,
    padding: "4px 10px",
    cursor: "pointer",
    fontSize: 16,
  },
  deleteButton: {
    padding: "6px 10px",
    borderRadius: 10,
    background: "transparent",
    border: "1px solid rgba(227,91,91,0.5)",
    color: "#E35B5B",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
  },
  familyContent: {
    padding: 14,
  },
  charactersList: {
    listStyle: "none",
    margin: "14px 0 0 0",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  characterItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    borderRadius: 12,
    backgroundColor: "#13212E",
    border: "1px solid #1F3448",
    color: "#EDEDED",
  },
  characterText: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
    alignItems: "center",
    fontSize: 13,
  },
  requiredTag: {
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    backgroundColor: "rgba(201,162,77,0.25)",
    border: "1px solid rgba(201,162,77,0.6)",
    color: "#EDEDED",
  },
  traits: {
    color: "#B8B8B8",
    fontSize: 12,
  },
  deleteCharButton: {
    padding: "6px 10px",
    borderRadius: 10,
    background: "transparent",
    border: "1px solid rgba(227,91,91,0.5)",
    color: "#E35B5B",
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 700,
  },
  emptyMessage: {
    marginTop: 14,
    fontSize: 12,
    color: "#B8B8B8",
    fontStyle: "italic",
  },
};
