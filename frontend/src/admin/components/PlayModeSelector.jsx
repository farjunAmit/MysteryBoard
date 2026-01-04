import { texts as t } from "../../texts";

export default function PlayModeSelector({ mode, onModeChange, onStart, disabled, allPhotosPresent, busy }) {
  const canPlay = !disabled && allPhotosPresent && !busy;

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: 12,
        padding: 12,
        border: "1px solid #ddd",
        borderRadius: 8,
        background: "#fafafa",
      }}
    >
      <strong>{t.admin.liveSession.play.label}</strong>

      <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
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

      <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
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

      <button
        type="button"
        onClick={onStart}
        disabled={!canPlay}
        style={{
          padding: "8px 14px",
          cursor: canPlay ? "pointer" : "not-allowed",
          fontWeight: 700,
        }}
        title={t.admin.liveSession.play.startTitle}
      >
        {t.admin.liveSession.play.start}
      </button>

      <span style={{ opacity: 0.8 }}>{t.admin.liveSession.play.hint}</span>
    </div>
  );
}
