import { useState } from "react";
import CharacterForm from "./CharacterForm";

export default function ScenarioForm({ onCancel, onCreated }) {
  const [name, setName] = useState(""); // scenario name input
  const [description, setDescription] = useState(""); // scenario description
  const [minPlayers, setMinPlayers] = useState(""); // minimum players (as string for input)
  const [maxPlayers, setMaxPlayers] = useState(""); // maximum players (as string for input)
  const [characters, setCharacters] = useState([]); // characters in the game
  const [error, setError] = useState(null); // validation error message

  function handleSubmit(e) {
    e.preventDefault(); // prevent page reload

    // Reset any previous error
    setError(null);

    // Validation: Name is required
    if (!name.trim()) {
      setError("יש להזין שם תרחיש");
      return;
    }

    // Validation: Minimum players required
    if (!minPlayers) {
      setError("יש להזין מינימום שחקנים");
      return;
    }

    // Validation: Maximum players required
    if (!maxPlayers) {
      setError("יש להזין מקסימום שחקנים");
      return;
    }

    // Optional: ensure min <= max
    if (Number(minPlayers) > Number(maxPlayers)) {
      setError("מינימום שחקנים לא יכול להיות גדול מהמקסימום");
      return;
    }

    const max = Number(maxPlayers);
    if (!max || characters.length !== max) {
      setError("כמות הדמויות חייבת להיות זהה למספר השחקנים המקסימאלי");
      return;
    }

    // If everything is valid → build payload
    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      minPlayers: Number(minPlayers),
      maxPlayers: Number(maxPlayers),
      characters,
    };

    console.log("Creating scenario with data:", payload);

    if (onCreated) {
      onCreated(payload);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Scenario name field */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 4 }}>שם התרחיש:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: 6,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Scenario description field */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 4 }}>
          תיאור (לא חובה)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{
            width: "100%",
            padding: 6,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Min / Max players fields */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: 4 }}>
            מינימום שחקנים
          </label>
          <input
            type="number"
            min="1"
            value={minPlayers}
            onChange={(e) => setMinPlayers(e.target.value)}
            style={{
              width: "100%",
              padding: 6,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: 4 }}>
            מקסימום שחקנים
          </label>
          <input
            type="number"
            min="1"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(e.target.value)}
            style={{
              width: "100%",
              padding: 6,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </div>
      </div>

      <CharacterForm onAdd={(char) => setCharacters([...characters, char])} />

      <ul>
        {characters.map((c) => (
          <li key={c.id}>
            {c.name} {c.required ? "(חובה)" : ""} - {c.traits.join(", ")}
          </li>
        ))}
      </ul>

      {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}

      {/* Cancel button */}
      <button
        type="button"
        onClick={onCancel}
        style={{
          padding: "6px 12px",
          borderRadius: 6,
          border: "1px solid #ccc",
          cursor: "pointer",
          backgroundColor: "#eee",
          marginRight: 12,
        }}
      >
        בטל
      </button>

      {/* Submit button */}
      <button
        type="submit"
        style={{
          padding: "6px 12px",
          borderRadius: 6,
          border: "none",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "white",
        }}
      >
        צור תרחיש
      </button>
    </form>
  );
}
