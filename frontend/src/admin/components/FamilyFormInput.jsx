import { useState } from "react";
import { texts as t } from "../../texts";
import "../styles/components/FamilyFormInput.css";

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
    <div className="family-form-input">
      <div className="family-form-input__group">
        <label className="family-form-input__label">
          {t.admin.familyForm.familyNameLabel}
        </label>
        <input
          type="text"
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
          placeholder={t.admin.familyForm.familyNamePlaceholder}
          className="family-form-input__input"
        />
      </div>

      <div className="family-form-input__group">
        <label className="family-form-input__label">
          {t.admin.familyForm.familyInfoLabel}
        </label>
        <textarea
          value={sharedInfo}
          onChange={(e) => setSharedInfo(e.target.value)}
          placeholder={t.admin.familyForm.familyInfoPlaceholder}
          rows={2}
          className="family-form-input__textarea"
        />
      </div>

      <div className="family-form-input__footer">
        <button
          type="button"
          disabled={!canAdd}
          onClick={handleAddFamily}
          className="family-form-input__button"
          style={{
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
