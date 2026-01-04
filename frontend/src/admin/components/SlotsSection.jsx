import SlotCard from "./SlotCard";
import { texts as t } from "../../texts";

const styles = {
  grid: {
    display: "grid",
    gap: 12,
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  },
  familiesSlotsContainer: {
    width: "100%",
    marginBottom: 16,
  },
  familySlotsSection: {
    marginBottom: 16,
    padding: 12,
    border: "1px solid #ddd",
    borderRadius: 8,
    background: "#fafafa",
  },
  familyTitle: {
    margin: "0 0 8px 0",
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  familySharedInfo: {
    margin: "0 0 8px 0",
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  familySlotsGrid: {
    display: "grid",
    gap: 12,
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    marginTop: 10,
  },
  familyEmpty: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
};

export default function SlotsSection({ session, scenario, busy, onSetPhoto }) {
  if (!session.slots || session.slots.length === 0) {
    return <p style={{ opacity: 0.8 }}>{t.admin.liveSession.states.noSlots}</p>;
  }

  if (scenario.mode === "characters") {
    return (
      <div style={styles.grid}>
        {session.slots.map((slot) => (
          <SlotCard key={slot.slotIndex} slot={slot} busy={busy} onSetPhoto={onSetPhoto} />
        ))}
      </div>
    );
  }

  // Groups mode
  return (
    <div style={styles.familiesSlotsContainer}>
      {(scenario.groups || []).map((group) => {
        const groupChars = group.characters || [];
        const slotsInThisFamily = (session.slots || []).filter((s) =>
          groupChars.some((c) => String(c._id) === String(s.characterId))
        );

        return (
          <div key={group._id} style={styles.familySlotsSection}>
            <h4 style={styles.familyTitle}>{group.name}</h4>

            {group.sharedInfo && <p style={styles.familySharedInfo}>{group.sharedInfo}</p>}

            {slotsInThisFamily.length === 0 ? (
              <div style={styles.familyEmpty}>{t.admin.liveSession.states.noSlots}</div>
            ) : (
              <div style={styles.familySlotsGrid}>
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
