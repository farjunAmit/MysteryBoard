import { useState } from "react";
import CharacterForm from "./CharacterForm";
import CharacterListForForms from "./CharacterListForForms";
import FamilyForm from "./FamilyForm";
import FamilyFormInput from "./FamilyFormInput";
import { texts as t } from "../../texts";

export default function ScenarioForm({ onCancel, onCreated }) {
  const [mode, setMode] = useState("characters");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [minPlayers, setMinPlayers] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("");
  const [characters, setCharacters] = useState([]);
  const [groups, setGroups] = useState([]);
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

    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      minPlayers: min,
      maxPlayers: max,
      mode,
    };

    if (mode === "characters") {
      if (characters.length !== max) {
        setError(t.admin.scenarioForm.validation.charactersMustMatchMax);
        return;
      }
      payload.characters = characters;
    } else if (mode === "groups") {
      // Todo: validate groups and characters inside
      if (groups.length === 0) {
        setError(t.admin.scenarioForm.validation.groupsRequired || "At least one family is required");
        return;
      }
      payload.groups = groups;
    }

    console.log("Creating scenario with data:", payload);
    onCreated?.(payload);
  }

  function handleRemoveCharacter(id) {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
    setError(null);
  }

  function handleAddFamily(familyName, sharedInfo) {
    setGroups((prev) => [
      ...prev,
      {
        id: Math.random().toString(36),
        name: familyName,
        sharedInfo,
        characters: [],
      },
    ]);
    setError(null);
  }

  function handleAddCharacterToFamily(familyIndex, character) {
    setGroups((prev) =>
      prev.map((fam, idx) =>
        idx === familyIndex
          ? {
              ...fam,
              characters: [...(fam.characters ?? []), character],
            }
          : fam
      )
    );
    setError(null);
  }

  function handleRemoveCharacterFromFamily(familyIndex, characterId) {
    setGroups((prev) =>
      prev.map((fam, idx) =>
        idx === familyIndex
          ? {
              ...fam,
              characters: (fam.characters ?? []).filter(
                (c) => c.id !== characterId
              ),
            }
          : fam
      )
    );
    setError(null);
  }

  function handleRemoveFamily(familyIndex) {
    setGroups((prev) => prev.filter((_, idx) => idx !== familyIndex));
    setError(null);
  }
  return (
    <form onSubmit={handleSubmit}>
      {/* Mode selection */}
      <div style={styles.modeSection}>
        <label style={styles.modeLabel}>
          {t.admin.scenarioForm.mode.label}
        </label>
        <div style={styles.modeOptions}>
          <label style={styles.modeOption}>
            <input
              type="radio"
              value="characters"
              checked={mode === "characters"}
              onChange={(e) => setMode(e.target.value)}
            />
            {t.admin.scenarioForm.mode.standard}
          </label>
          <label style={styles.modeOption}>
            <input
              type="radio"
              value="groups"
              checked={mode === "groups"}
              onChange={(e) => setMode(e.target.value)}
            />
            {t.admin.scenarioForm.mode.families}
          </label>
        </div>
      </div>

      {/* Scenario name */}
      <div style={styles.formGroup}>
        <label style={styles.label}>
          {t.admin.scenarioForm.labels.scenarioName}:
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* Description */}
      <div style={styles.formGroup}>
        <label style={styles.label}>
          {t.admin.scenarioForm.labels.description}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={styles.textarea}
        />
      </div>

      {/* Player counts */}
      <div style={styles.playerCountsRow}>
        <div style={styles.playerCountCol}>
          <label style={styles.label}>
            {t.admin.scenarioForm.labels.minPlayers}
          </label>
          <input
            type="number"
            min="1"
            value={minPlayers}
            onChange={(e) => setMinPlayers(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.playerCountCol}>
          <label style={styles.label}>
            {t.admin.scenarioForm.labels.maxPlayers}
          </label>
          <input
            type="number"
            min="1"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(e.target.value)}
            style={styles.input}
          />
        </div>
      </div>

      {/* STANDARD MODE */}
      {mode === "characters" && (
        <>
          <CharacterForm
            onAdd={(char) => setCharacters((prev) => [...prev, char])}
          />

          <CharacterListForForms
            characters={characters}
            onRemove={handleRemoveCharacter}
          />
        </>
      )}

      {/* FAMILIES MODE */}
      {mode === "groups" && (
        <>
          <FamilyFormInput onAdd={handleAddFamily} />

          <div>
            {groups.map((family, idx) => (
              <FamilyForm
                key={idx}
                familyIndex={idx}
                family={family}
                onAddCharacter={handleAddCharacterToFamily}
                onRemoveCharacter={handleRemoveCharacterFromFamily}
                onRemoveFamily={handleRemoveFamily}
              />
            ))}
          </div>

          {groups.length === 0 && (
            <p style={{ marginTop: 12, color: "#999", fontStyle: "italic" }}>
              No families added yet
            </p>
          )}
        </>
      )}

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.buttonContainer}>
        <button type="button" onClick={onCancel} style={styles.cancelButton}>
          {t.common.actions.cancel}
        </button>

        <button type="submit" style={styles.submitButton}>
          {t.common.actions.create}
        </button>
      </div>
    </form>
  );
}

const styles = {
  modeSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#13212E",
    border: "1px solid #1F3448",
    borderRadius: 12,
    color: "#EDEDED",
  },
  modeLabel: {
    display: "block",
    marginBottom: 8,
    fontWeight: 800,
    color: "#B8B8B8",
  },
  modeOptions: {
    display: "flex",
    gap: 16,
  },
  modeOption: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#EDEDED",
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
  },
  playerCountsRow: {
    display: "flex",
    gap: 20,
    marginBottom: 12,
  },
  playerCountCol: {
    flex: 1,
  },
  error: {
    color: "#E35B5B",
    marginBottom: 12,
    fontWeight: 700,
  },
  buttonContainer: {
    marginTop: 16,
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelButton: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid #1F3448",
    cursor: "pointer",
    backgroundColor: "transparent",
    color: "#EDEDED",
  },
  submitButton: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid #C9A24D",
    cursor: "pointer",
    backgroundColor: "#C9A24D",
    color: "#0B0F14",
    fontWeight: 800,
  },
};
