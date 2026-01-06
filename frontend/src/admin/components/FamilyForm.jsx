import { useState } from "react";
import CharacterForm from "./CharacterForm";
import CharacterListForForms from "./CharacterListForForms";
import { texts as t } from "../../texts";
import "../styles/components/FamilyForm.css";

export default function FamilyForm({
  familyIndex,
  family,
  onAddCharacter,
  onRemoveCharacter,
  onRemoveFamily,
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="family-form__card">
      {/* Header */}
      <div className="family-form__header">
        <div className="family-form__info">
          <h3 className="family-form__name">{family.name}</h3>
          {family.sharedInfo && (
            <p className="family-form__shared-info">{family.sharedInfo}</p>
          )}
        </div>

        <div className="family-form__actions">
          <button
            type="button"
            onClick={() => setIsExpanded((v) => !v)}
            className="family-form__expand-button"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? "▾" : "▸"}
          </button>

          <button
            type="button"
            onClick={() => onRemoveFamily(familyIndex)}
            className="family-form__delete-button"
            title={t.common.actions.delete}
          >
            {t.common.actions.delete}
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="family-form__content">
          {/* Add character */}
          <CharacterForm onAdd={(char) => onAddCharacter(familyIndex, char)} />

          {/* Characters list */}
          <CharacterListForForms
            characters={family.characters}
            onRemove={(charId) => onRemoveCharacter(familyIndex, charId)}
          />
        </div>
      )}
    </div>
  );
}
