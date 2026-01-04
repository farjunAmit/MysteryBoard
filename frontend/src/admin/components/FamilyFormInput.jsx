import { useState } from "react";
import { texts as t } from "../../texts";

export default function FamilyFormInput({ onAdd }) {
  const [familyName, setFamilyName] = useState("");
  const [sharedInfo, setSharedInfo] = useState("");

  function handleAddFamily(e) {
    e.preventDefault();

    if (!familyName.trim()) {
      alert(t.admin.familyForm.familyNameRequired);
      return;
    }

    onAdd(familyName.trim(), sharedInfo.trim());

    setFamilyName("");
    setSharedInfo("");
  }

  return (
    <form onSubmit={handleAddFamily} style={styles.form}>
      <div style={styles.formGroup}>
        <label style={styles.label}>
          {t.admin.familyForm.familyNameLabel}:
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
          {t.admin.familyForm.familyInfoLabel}:
        </label>
        <textarea
          value={sharedInfo}
          onChange={(e) => setSharedInfo(e.target.value)}
          placeholder={t.admin.familyForm.familyInfoPlaceholder}
          rows={2}
          style={styles.textarea}
        />
      </div>

      <button
        type="submit"
        style={styles.submitButton}
        onClick={(e) => {
          e.preventDefault();
          handleAddFamily(e);
        }}
      >
        {t.admin.familyForm.addFamily}
      </button>
    </form>
  );
}

const styles = {
  form: {
    marginBottom: 16,
    padding: 12,
    border: "1px solid #ddd",
    borderRadius: 6,
    backgroundColor: "#f9f9f9",
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    display: "block",
    marginBottom: 4,
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: 6,
    borderRadius: 4,
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: 6,
    borderRadius: 4,
    border: "1px solid #ccc",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  submitButton: {
    padding: "8px 16px",
    borderRadius: 4,
    border: "none",
    backgroundColor: "#28a745",
    color: "white",
    cursor: "pointer",
    fontWeight: "500",
  },
};
