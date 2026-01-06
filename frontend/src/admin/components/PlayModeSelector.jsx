import { texts as t } from "../../texts";
import "../styles/components/PlayModeSelector.css";

export default function PlayModeSelector({ mode, onModeChange, onStart, disabled, allPhotosPresent, busy }) {
  const canPlay = !disabled && allPhotosPresent && !busy;

  return (
    <div className="play-mode-selector">
      <strong className="play-mode-selector__label">{t.admin.liveSession.play.label}</strong>

      <div className="play-mode-selector__options">
        <label className="play-mode-selector__option">
          <input
            type="radio"
            name="revealMode"
            value="slow"
            checked={mode === "slow"}
            onChange={() => onModeChange("slow")}
            disabled={busy}
          />
          {t.admin.liveSession.play.modes.slow}
        </label>

        <label className="play-mode-selector__option">
          <input
            type="radio"
            name="revealMode"
            value="fast"
            checked={mode === "fast"}
            onChange={() => onModeChange("fast")}
            disabled={busy}
          />
          {t.admin.liveSession.play.modes.fast}
        </label>
      </div>

      <button
        type="button"
        onClick={onStart}
        disabled={!canPlay}
        className="play-mode-selector__button"
        style={{
          opacity: canPlay ? 1 : 0.55,
          cursor: canPlay ? "pointer" : "not-allowed",
        }}
        title={t.admin.liveSession.play.startTitle}
      >
        {t.admin.liveSession.play.start}
      </button>

      <span className="play-mode-selector__hint">{t.admin.liveSession.play.hint}</span>
    </div>
  );
}
