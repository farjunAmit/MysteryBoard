import OptionalCharactersList from "./OptionalCharactersList";
import { texts as t } from "../../texts";
import "../styles/components/GroupsSection.css";

export default function GroupsSection({ scenario, session, canAddMore, onAddCharacter }) {
  return (
    <div className="groups-section">
      <strong className="groups-section__title">{t.admin.liveSession.characters.optional}</strong>

      <div className="groups-section__list">
        {(scenario.groups || []).map((group) => (
          <div key={group._id} className="groups-section__card">
            <h4 className="groups-section__card-name">{group.name}</h4>
            {group.sharedInfo && (
              <p className="groups-section__card-info">{group.sharedInfo}</p>
            )}

            <OptionalCharactersList
              characters={group.characters}
              slots={session.slots}
              canAddMore={canAddMore}
              onAddCharacter={onAddCharacter}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
