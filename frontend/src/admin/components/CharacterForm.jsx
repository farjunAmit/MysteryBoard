import { useState } from "react";
import { texts as t } from "../../texts";
import "../styles/components/CharacterForm.css";

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
    <div className="character-form">
      {/* Name */}
      <div className="character-form__group">
        <label className="character-form__label">{t.admin.characterForm.nameLabel || "Name"}</label>
        <input
          className="character-form__input"
          placeholder={t.admin.characterForm.namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Required Toggle */}
      <div className="character-form__group">
        <div className="character-form__toggle-row">
          <div style={{ minWidth: 0 }}>
            <div className="character-form__toggle-title">
              {t.admin.characterForm.requiredLabel}
            </div>
            <div className="character-form__hint">
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
            className={`character-form__toggle-track ${
              required ? "character-form__toggle-track--active" : "character-form__toggle-track--inactive"
            }`}
            title={t.admin.characterForm.requiredLabel}
          >
            <div
              className={`character-form__toggle-thumb ${
                required ? "character-form__toggle-thumb--active" : "character-form__toggle-thumb--inactive"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Traits */}
      <div className="character-form__group">
        <label className="character-form__label">{t.admin.characterForm.traitsLabel || "Traits"}</label>
        <input
          className="character-form__input"
          placeholder={t.admin.characterForm.traitsPlaceholder}
          value={traits}
          onChange={(e) => setTraits(e.target.value)}
        />
        <div className="character-form__hint">
          {t.admin.characterForm.traitsHint ||
            "Separate traits with commas. Example: tall, smoker, left-handed"}
        </div>
      </div>

      {/* Add */}
      <div className="character-form__footer">
        <button
          type="button"
          onClick={handleAddClick}
          disabled={!canAdd}
          className="character-form__button"
          style={{
            opacity: canAdd ? 1 : 0.55,
            cursor: canAdd ? "pointer" : "not-allowed",
          }}
        >
          {t.admin.characterForm.addCharacter}
        </button>
      </div>
    </div>
  );
}
