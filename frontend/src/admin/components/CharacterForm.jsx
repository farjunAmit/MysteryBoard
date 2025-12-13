import { useState } from "react";

export default function CharacterForm({ onAdd }) {
  const [name, setName] = useState(""); //character name
  const [required, setRequired] = useState(false); //if this character is must in the scenario
  const [traits, setTraits] = useState(""); //character traits

  function handleAddClick(e) {
    onAdd({
      id: Date.now(),
      name,
      required,
      traits: traits.split(",").map((t) => t.trim()), //split traits with "," and remove spaces
    });

    setName("");
    setTraits("");
    setRequired(false);
  }

  return (
    <div>
      <input
        placeholder="שם הדמות"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>
        <input
          type="checkbox"
          checked={required}
          onChange={(e) => setRequired(e.target.checked)}
        />
        דמות חובה
      </label>

      <input
        placeholder="תכונות (מופרדות בפסיק)"
        value={traits}
        onChange={(e) => setTraits(e.target.value)}
      />

      <button
        type="button" // 👈 חשוב! לא submit
        onClick={handleAddClick}
      >
        הוסף דמות
      </button>
    </div>
  );
}
