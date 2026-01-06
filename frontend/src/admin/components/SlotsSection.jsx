import { useMemo } from "react";
import { adminTheme, createAdminStyles } from "../ui/adminTheme";
import SlotCard from "./SlotCard";
import { texts as t } from "../../texts";

export default function SlotsSection({ session, scenario, busy, onSetPhoto }) {
  const theme = adminTheme;
  const styles = useMemo(() => createAdminStyles(theme), []);

  if (!session.slots || session.slots.length === 0) {
    return <p style={slotStyles.emptyMessage}>{t.admin.liveSession.states.noSlots}</p>;
  }

  if (scenario.mode === "characters") {
    return (
      <div style={slotStyles.grid}>
        {session.slots.map((slot) => (
          <SlotCard key={slot.slotIndex} slot={slot} busy={busy} onSetPhoto={onSetPhoto} />
        ))}
      </div>
    );
  }

  // Groups mode
  return (
    <div style={slotStyles.groupsContainer}>
      {(scenario.groups || []).map((group) => {
        const groupChars = group.characters || [];
        const slotsInThisFamily = (session.slots || []).filter((s) =>
          groupChars.some((c) => String(c._id) === String(s.characterId))
        );

        return (
          <div key={group._id} style={slotStyles.groupCard}>
            <h4 style={slotStyles.groupTitle}>{group.name}</h4>

            {group.sharedInfo && <p style={slotStyles.groupInfo}>{group.sharedInfo}</p>}

            {slotsInThisFamily.length === 0 ? (
              <div style={slotStyles.emptyMessage}>{t.admin.liveSession.states.noSlots}</div>
            ) : (
              <div style={slotStyles.groupGrid}>
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

const slotStyles = {
  grid: {
    display: "grid",
    gap: 12,
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    marginBottom: 16,
  },
  groupsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginBottom: 16,
  },
  groupCard: {
    padding: 14,
    border: "1px solid #1F3448",
    borderRadius: 12,
    backgroundColor: "#162635",
  },
  groupTitle: {
    margin: "0 0 8px 0",
    fontSize: 16,
    fontWeight: 800,
    color: "#EDEDED",
  },
  groupInfo: {
    margin: "0 0 12px 0",
    fontSize: 12,
    color: "#B8B8B8",
    fontStyle: "italic",
  },
  groupGrid: {
    display: "grid",
    gap: 12,
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  },
  emptyMessage: {
    fontSize: 12,
    color: "#B8B8B8",
    fontStyle: "italic",
  },
};
