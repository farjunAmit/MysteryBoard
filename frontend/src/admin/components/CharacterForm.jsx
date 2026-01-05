import { useState } from "react";
import { texts as t } from "../../texts";

export default function CharacterForm({ onAdd }) {
  const [name, setName] = useState("");
  const [required, setRequired] = useState(false);
  const [traits, setTraits] = useState("");

  const canAdd = name.trim().length > 0;

  function handleAddClick() {
    if (!canAdd) return;

    onAdd({
      id: Math.random().toString(36).substring(2, 11),
      name: name.trim(),
      required,
      traits: traits
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    });

    setName("");
    setTraits("");
    setRequired(false);
  }

  return (
    <div style={styles.root}>
      {/* Name */}
      <div style={styles.group}>
        <label style={styles.label}>{t.admin.characterForm.nameLabel || "Name"}</label>
        <input
          style={styles.input}
          placeholder={t.admin.characterForm.namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Required Toggle */}
      <div style={styles.group}>
        <div style={styles.toggleRow}>
          <div style={{ minWidth: 0 }}>
            <div style={styles.toggleTitle}>
              {t.admin.characterForm.requiredLabel}
            </div>
            <div style={styles.hint}>
              {t.admin.characterForm.requiredHint ||
                "Required characters are always included in the session."}
            </div>
          </div>

          <div
            role="switch"
            aria-checked={required}
            tabIndex={0}
            onClick={() => setRequired((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setRequired((v) => !v);
              }
            }}
            style={{
              ...styles.toggleTrack,
              backgroundColor: required ? "rgba(201,162,77,0.35)" : "#0E1A24",
              borderColor: required ? "rgba(201,162,77,0.8)" : "#1F3448",
            }}
            title={t.admin.characterForm.requiredLabel}
          >
            <div
              style={{
                ...styles.toggleThumb,
                transform: required ? "translateX(18px)" : "translateX(0px)",
                backgroundColor: required ? "#C9A24D" : "#B8B8B8",
              }}
            />
          </div>
        </div>
      </div>

      {/* Traits */}
      <div style={styles.group}>
        <label style={styles.label}>{t.admin.characterForm.traitsLabel || "Traits"}</label>
        <input
          style={styles.input}
          placeholder={t.admin.characterForm.traitsPlaceholder}
          value={traits}
          onChange={(e) => setTraits(e.target.value)}
        />
        <div style={styles.hint}>
          {t.admin.characterForm.traitsHint ||
            "Separate traits with commas. Example: tall, smoker, left-handed"}
        </div>
      </div>

      {/* Add */}
      <div style={styles.footer}>
        <button
          type="button"
          onClick={handleAddClick}
          disabled={!canAdd}
          style={{
            ...styles.addBtn,
            opacity: canAdd ? 1 : 0.55,
            cursor: canAdd ? "pointer" : "not-allowed",
          }}
          onMouseEnter={(e) => {
            if (canAdd) e.currentTarget.style.background = "#B08C3A";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#C9A24D";
          }}
        >
          {t.admin.characterForm.addCharacter}
        </button>
      </div>
    </div>
  );
}

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  group: { marginBottom: 0 },
  label: { display: "block", marginBottom: 6, color: "#B8B8B8", fontSize: 13 },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #1F3448",
    backgroundColor: "#13212E",
    color: "#EDEDED",
    outline: "none",
  },
  hint: { marginTop: 6, color: "#B8B8B8", fontSize: 12 },

  toggleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #1F3448",
    backgroundColor: "#13212E",
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#EDEDED",
    marginBottom: 2,
  },
  toggleTrack: {
    width: 44,
    height: 26,
    borderRadius: 999,
    border: "1px solid #1F3448",
    padding: 3,
    cursor: "pointer",
    flex: "0 0 auto",
    display: "flex",
    alignItems: "center",
    transition: "background-color 150ms ease, border-color 150ms ease",
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 999,
    transition: "transform 150ms ease, background-color 150ms ease",
  },

  footer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  addBtn: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid #C9A24D",
    backgroundColor: "#C9A24D",
    color: "#0B0F14",
    fontWeight: 800,
  },
};
