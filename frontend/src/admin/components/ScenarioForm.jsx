import { useState } from "react";
import CharacterForm from "./CharacterForm";
import { texts as t } from "../../texts";

export default function ScenarioForm({ onCancel, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [minPlayers, setMinPlayers] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("");
  const [characters, setCharacters] = useState([]);
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();

    setError(null);
    const min = Number(minPlayers);
    const max = Number(maxPlayers);

    if (!name.trim()) {
      setError(t.admin.scenarioForm.validation.nameRequired);
      return;
    }

    if (!min) {
      setError(t.admin.scenarioForm.validation.minPlayersRequired);
      return;
    }

    if (!max) {
      setError(t.admin.scenarioForm.validation.maxPlayersRequired);
      return;
    }

    if (min > max) {
      setError(t.admin.scenarioForm.validation.minGreaterThanMax);
      return;
    }

    if (characters.length !== max) {
      setError(t.admin.scenarioForm.validation.charactersMustMatchMax);
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      minPlayers: min,
      maxPlayers: max,
      characters,
    };

    console.log("Creating scenario with data:", payload);

    onCreated?.(payload);
  }

  function handleRemoveCharacter(id) {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
    setError(null);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 4 }}>
          {t.admin.scenarioForm.labels.scenarioName}:
        </label>
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

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 4 }}>
          {t.admin.scenarioForm.labels.description}
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

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: 4 }}>
            {t.admin.scenarioForm.labels.minPlayers}
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
            {t.admin.scenarioForm.labels.maxPlayers}
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

      <CharacterForm onAdd={(char) => setCharacters((prev) => [...prev, char])} />

      <ul>
        {characters.map((c) => (
          <li key={c.id}>
            {c.name} {c.required ? t.admin.scenarioForm.characterList.requiredTag : ""} -{" "}
            {c.traits.join(", ")}
            <button type="button" onClick={() => handleRemoveCharacter(c.id)}>
              {t.common.actions.delete}
            </button>
          </li>
        ))}
      </ul>

      {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}

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
        {t.common.actions.cancel}
      </button>

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
        {t.common.actions.create}
      </button>
    </form>
  );
}
