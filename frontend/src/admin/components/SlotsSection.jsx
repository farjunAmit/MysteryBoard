import SlotCard from "./SlotCard";
import { texts as t } from "../../texts";
import "../styles/components/SlotsSection.css";

export default function SlotsSection({ session, scenario, busy, onSetPhoto }) {
  if (!session.slots || session.slots.length === 0) {
    return <p className="slots-section__empty-message">{t.admin.liveSession.states.noSlots}</p>;
  }

  if (scenario.mode === "characters") {
    return (
      <div className="slots-section__grid">
        {session.slots.map((slot) => (
          <SlotCard key={slot.slotIndex} slot={slot} busy={busy} onSetPhoto={onSetPhoto} />
        ))}
      </div>
    );
  }

  // Groups mode
  return (
    <div className="slots-section__groups-container">
      {(scenario.groups || []).map((group) => {
        const groupChars = group.characters || [];
        const slotsInThisFamily = (session.slots || []).filter((s) =>
          groupChars.some((c) => String(c._id) === String(s.characterId))
        );

        return (
          <div key={group._id} className="slots-section__group-card">
            <h4 className="slots-section__group-title">{group.name}</h4>

            {group.sharedInfo && <p className="slots-section__group-info">{group.sharedInfo}</p>}

            {slotsInThisFamily.length === 0 ? (
              <div className="slots-section__empty-message">{t.admin.liveSession.states.noSlots}</div>
            ) : (
              <div className="slots-section__group-grid">
                {slotsInThisFamily.map((slot) => {
                  const charName =
                    groupChars.find((c) => String(c._id) === String(slot.characterId))?.name ||
                    String(slot.characterId);

                  return (
                    <SlotCard
                      key={slot.slotIndex}
                      slot={slot}
                      characterName={charName}
                      busy={busy}
                      onSetPhoto={onSetPhoto}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
