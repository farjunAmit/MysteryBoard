import { useRef, useState } from "react";
import { texts } from "../../texts";
import { SessionsApi } from "../../api/sessions.api";
import "../styles/components/CharacterCard.css";

export default function CharacterCard({
  character,
  isRevealed,
  sessionId,
  slotIndex,
  isSetupPhase = false,
  onPhotoUpload,
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const photoUrl = sessionId && slotIndex !== undefined
    ? `/api/sessions/${sessionId}/slots/${slotIndex}/photo`
    : null;

  const handlePhotoClick = () => {
    if (isSetupPhase && !uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !sessionId || slotIndex === undefined) return;

    try {
      setUploading(true);
      setUploadError(null);
      await SessionsApi.uploadSlotPhoto(sessionId, slotIndex, file);
      onPhotoUpload?.();
    } catch (err) {
      setUploadError(err?.message || texts.client.characterCard.uploadError);
      console.error("Photo upload failed:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="character-card">
      {/* Header */}
      <div className="character-card__header">
        {/* Avatar */}
        <div className="character-card__avatar-container">
          <div
            className="character-card__avatar"
            onClick={handlePhotoClick}
            style={{ cursor: isSetupPhase ? "pointer" : "default" }}
          >
            {isRevealed &&
              (photoUrl ? (
                <img
                  src={photoUrl}
                  alt={character.name}
                />
              ) : (
                <span>{texts.client.characterCard.noPhoto}</span>
              ))}
          </div>
          {isSetupPhase && isRevealed && (
            <>
              <button
                className="character-card__avatar-upload"
                onClick={handlePhotoClick}
                disabled={uploading}
                title="Upload photo"
              >
                📷
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="character-card__avatar-input"
                onChange={handleFileSelect}
              />
            </>
          )}
        </div>

        {/* Name + hint */}
        <div className="character-card__content">
          {isRevealed && (
            <>
              <h3 className="character-card__name">
                {character.name}
              </h3>
              {character.roleHint && (
                <p className="character-card__role-hint">
                  {character.roleHint}
                </p>
              )}
              {uploading && (
                <div className="character-card__upload-status">
                  {texts.client.characterCard.uploading}
                </div>
              )}
              {uploadError && (
                <div className="character-card__upload-error">
                  {uploadError}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Traits (only when revealed) */}
      {isRevealed &&
        Array.isArray(character.traits) &&
        character.traits.length > 0 && (
          <div className="character-card__traits">
            <ul className="character-card__traits-list">
              {character.traits.map((trait, idx) => (
                <li key={idx} className="character-card__traits-item">
                  {trait}
                </li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
}