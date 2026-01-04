import { texts as t } from "../../texts";

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 12,
    background: "#f8f8f8",
  },
  photoStatus: {
    marginTop: 6,
    fontSize: 12,
  },
};

export default function SlotCard({ slot, characterName, busy, onSetPhoto }) {
  return (
    <div style={styles.card} key={slot.slotIndex}>
      <div>
        <strong>{t.admin.liveSession.slots.slot}:</strong> {slot.slotIndex}
      </div>

      {characterName ? (
        <div style={{ wordBreak: "break-word" }}>
          <strong>{t.admin.liveSession.slots.characterId}:</strong> {characterName}
        </div>
      ) : (
        <div style={{ wordBreak: "break-all" }}>
          <strong>{t.admin.liveSession.slots.characterId}:</strong> {slot.characterId}
        </div>
      )}

      <div style={{ marginTop: 8 }}>
        <strong>{t.admin.liveSession.slots.photo}:</strong>
        <div
          style={{
            ...styles.photoStatus,
            color: slot.photoUrl ? "green" : "crimson",
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
        style={{ marginTop: 8 }}
      >
        {t.admin.liveSession.slots.setPhoto}
      </button>
    </div>
  );
}
