import OptionalCharactersList from "./OptionalCharactersList";
import { texts as t } from "../../texts";
import "../styles/components/CharacterSection.css";

export default function CharacterSection({ scenario, session, canAddMore, onAddCharacter }) {
  return (
    <div className="character-section">
      <div className="character-section__card">
        <strong className="character-section__title">{t.admin.liveSession.characters.mandatory}</strong>
        <ul className="character-section__list">
          {(scenario.characters || [])
            .filter((c) => c.required)
            .map((c) => (
              <li key={c._id} className="character-section__list-item">{c.name}</li>
            ))}
        </ul>
      </div>

      <div className="character-section__card">
        <strong className="character-section__title">{t.admin.liveSession.characters.optional}</strong>
        <OptionalCharactersList
          characters={scenario.characters}
          slots={session.slots}
          canAddMore={canAddMore}
          onAddCharacter={onAddCharacter}
        />
      </div>
    </div>
  );
}
