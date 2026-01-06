import { useMemo } from "react";
import { adminTheme, createAdminStyles } from "../ui/adminTheme";
import { texts as t } from "../../texts";

export default function PlayModeSelector({ mode, onModeChange, onStart, disabled, allPhotosPresent, busy }) {
  const theme = adminTheme;
  const styles = useMemo(() => createAdminStyles(theme), []);

  const canPlay = !disabled && allPhotosPresent && !busy;

  return (
    <div style={playStyles.container}>
      <strong style={playStyles.label}>{t.admin.liveSession.play.label}</strong>

      <div style={playStyles.options}>
        <label style={playStyles.option}>
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

        <label style={playStyles.option}>
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
        style={{
          ...playStyles.startButton,
          opacity: canPlay ? 1 : 0.55,
          cursor: canPlay ? "pointer" : "not-allowed",
        }}
        title={t.admin.liveSession.play.startTitle}
      >
        {t.admin.liveSession.play.start}
      </button>

      <span style={playStyles.hint}>{t.admin.liveSession.play.hint}</span>
    </div>
  );
}

const playStyles = {
  container: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 16,
    padding: 14,
    border: "1px solid #1F3448",
    borderRadius: 12,
    backgroundColor: "#162635",
  },
  label: {
    color: "#B8B8B8",
    fontSize: 13,
    fontWeight: 700,
  },
  options: {
    display: "flex",
    gap: 16,
  },
  option: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#EDEDED",
    fontSize: 13,
  },
  startButton: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid #C9A24D",
    backgroundColor: "#C9A24D",
    color: "#0B0F14",
    fontWeight: 800,
  },
  hint: {
    color: "#B8B8B8",
    fontSize: 12,
    fontStyle: "italic",
  },
};
