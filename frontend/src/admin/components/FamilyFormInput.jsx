import { useState } from "react";
import { texts as t } from "../../texts";

export default function FamilyFormInput({ onAdd }) {
  const [familyName, setFamilyName] = useState("");
  const [sharedInfo, setSharedInfo] = useState("");

  const canAdd = familyName.trim().length > 0;

  function handleAddFamily() {
    if (!canAdd) return;

    onAdd(familyName.trim(), sharedInfo.trim());
    setFamilyName("");
    setSharedInfo("");
  }

  return (
    <div style={styles.form}>
      <div style={styles.formGroup}>
        <label style={styles.label}>
          {t.admin.familyForm.familyNameLabel}
        </label>
        <input
          type="text"
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
          placeholder={t.admin.familyForm.familyNamePlaceholder}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          {t.admin.familyForm.familyInfoLabel}
        </label>
        <textarea
          value={sharedInfo}
          onChange={(e) => setSharedInfo(e.target.value)}
          placeholder={t.admin.familyForm.familyInfoPlaceholder}
          rows={2}
          style={styles.textarea}
        />
      </div>

      <div style={styles.footer}>
        <button
          type="button"
          disabled={!canAdd}
          onClick={handleAddFamily}
          style={{
            ...styles.submitButton,
            opacity: canAdd ? 1 : 0.55,
            cursor: canAdd ? "pointer" : "not-allowed",
          }}
        >
          {t.admin.familyForm.addFamily}
        </button>
      </div>
    </div>
  );
}

const styles = {
  form: {
    marginBottom: 16,
    padding: 14,
    borderRadius: 14,
    border: "1px solid #1F3448",
    backgroundColor: "#162635",
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    display: "block",
    marginBottom: 6,
    color: "#B8B8B8",
    fontSize: 13,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #1F3448",
    backgroundColor: "#13212E",
    color: "#EDEDED",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #1F3448",
    backgroundColor: "#13212E",
    color: "#EDEDED",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  submitButton: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid #C9A24D",
    backgroundColor: "#C9A24D",
    color: "#0B0F14",
    fontWeight: 800,
  },
};
