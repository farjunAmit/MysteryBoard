import { texts as t } from "../../texts";

export default function CharacterListForForms({ characters, onRemove }) {
  if (!characters || characters.length === 0) {
    return (
      <p style={styles.emptyMessage}>
        {t.admin.familyForm.noCharactersAdded}
      </p>
    );
  }

  return (
    <ul style={styles.charactersList}>
      {characters.map((c) => (
        <li key={c.id} style={styles.characterItem}>
          <div style={styles.characterText}>
            <strong>{c.name}</strong>
            {c.required && (
              <span style={styles.requiredTag}>
                {t.admin.scenarioForm.characterList.requiredTag}
              </span>
            )}
            {c.traits && c.traits.length > 0 && (
              <span style={styles.traits}>
                — {c.traits.join(", ")}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onRemove(c.id)}
            style={styles.deleteButton}
          >
            {t.common.actions.delete}
          </button>
        </li>
      ))}
    </ul>
  );
}

const styles = {
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
  deleteButton: {
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
