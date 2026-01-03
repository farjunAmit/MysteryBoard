import { useState } from "react";
import { texts as t } from "../../texts";

export default function CharacterForm({ onAdd }) {
  const [name, setName] = useState("");
  const [required, setRequired] = useState(false);
  const [traits, setTraits] = useState("");

  function handleAddClick(e) {
    onAdd({
      id: Date.now(),
      name,
      required,
      traits: traits.split(",").map((t) => t.trim()),
    });

    setName("");
    setTraits("");
    setRequired(false);
  }

  return (
    <div>
      <input
        placeholder={t.admin.characterForm.namePlaceholder}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>
        <input
          type="checkbox"
          checked={required}
          onChange={(e) => setRequired(e.target.checked)}
        />
        {t.admin.characterForm.requiredLabel}
      </label>

      <input
        placeholder={t.admin.characterForm.traitsPlaceholder}
        value={traits}
        onChange={(e) => setTraits(e.target.value)}
      />

      <button
        type="button"
        onClick={handleAddClick}
      >
        {t.admin.characterForm.addCharacter}
      </button>
    </div>
  );
}