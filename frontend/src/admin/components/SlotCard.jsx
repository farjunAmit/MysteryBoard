import { texts as t } from "../../texts";
import "../styles/components/SlotCard.css";

export default function SlotCard({ slot, characterName, busy, hasPhoto, onSetPhoto, sessionId }) {
  const photoUrl = sessionId && hasPhoto
    ? `/api/sessions/${sessionId}/slots/${slot.slotIndex}/photo`
    : null;

  return (
    <div className="slot-card">
      <div className="slot-card__row">
        <strong className="slot-card__label">{t.admin.liveSession.slots.slot}:</strong>
        <span className="slot-card__value">{slot.slotIndex}</span>
      </div>

      <div className="slot-card__row">
        <strong className="slot-card__label">{t.admin.liveSession.slots.characterId}:</strong>
        <span className="slot-card__value" style={{ wordBreak: "break-word" }}>
          {characterName || slot.characterId}
        </span>
      </div>

      <div className="slot-card__photo-section">
        <strong className="slot-card__label">{t.admin.liveSession.slots.photo}:</strong>
        <div
          className={`slot-card__photo-status ${
            hasPhoto ? "slot-card__photo-status--ok" : "slot-card__photo-status--missing"
          }`}
        >
          {hasPhoto
            ? t.admin.liveSession.slots.photoOk
            : t.admin.liveSession.slots.photoMissing}
        </div>
        
        {photoUrl && (
          <div className="slot-card__photo-preview">
            <img src={photoUrl} alt={`Photo for slot ${slot.slotIndex}`} />
          </div>
        )}
      </div>

      <button
        type="button"
        disabled={busy}
        onClick={() => onSetPhoto(slot)}
        className="slot-card__button"
        style={{
          opacity: busy ? 0.55 : 1,
          cursor: busy ? "not-allowed" : "pointer",
        }}
      >
        {t.admin.liveSession.slots.setPhoto}
      </button>
    </div>
  );
}
