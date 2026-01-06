import { texts as t } from "../../texts";

export default function SlotCard({ slot, characterName, busy, onSetPhoto }) {
  return (
    <div style={slotStyles.card}>
      <div style={slotStyles.row}>
        <strong style={slotStyles.label}>{t.admin.liveSession.slots.slot}:</strong>
        <span style={slotStyles.value}>{slot.slotIndex}</span>
      </div>

      <div style={slotStyles.row}>
        <strong style={slotStyles.label}>{t.admin.liveSession.slots.characterId}:</strong>
        <span style={{ ...slotStyles.value, wordBreak: "break-word" }}>
          {characterName || slot.characterId}
        </span>
      </div>

      <div style={slotStyles.photoSection}>
        <strong style={slotStyles.label}>{t.admin.liveSession.slots.photo}:</strong>
        <div
          style={{
            ...slotStyles.photoStatus,
            color: slot.photoUrl ? "#4CAF50" : "#E35B5B",
          }}
        >
          {slot.photoUrl
            ? t.admin.liveSession.slots.photoOk
            : t.admin.liveSession.slots.photoMissing}
        </div>
      </div>

      <button
        type="button"
        disabled={busy}
        onClick={() => onSetPhoto(slot)}
        style={{
          ...slotStyles.setPhotoButton,
          opacity: busy ? 0.55 : 1,
          cursor: busy ? "not-allowed" : "pointer",
        }}
      >
        {t.admin.liveSession.slots.setPhoto}
      </button>
    </div>
  );
}

const slotStyles = {
  card: {
    padding: 14,
    border: "1px solid #1F3448",
    borderRadius: 12,
    backgroundColor: "#162635",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  row: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  label: {
    color: "#B8B8B8",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  value: {
    color: "#EDEDED",
    fontSize: 13,
  },
  photoSection: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  photoStatus: {
    fontSize: 12,
    fontWeight: 700,
  },
  setPhotoButton: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid #C9A24D",
    backgroundColor: "#C9A24D",
    color: "#0B0F14",
    fontWeight: 800,
    fontSize: 13,
  },
};
