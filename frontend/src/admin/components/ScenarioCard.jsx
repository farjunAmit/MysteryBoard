export default function ScenarioCard({ scenario, theme, onStartLive, onDelete }) {
  const playersText =
    scenario.minPlayers || scenario.maxPlayers
      ? `Players: ${scenario.minPlayers ?? "?"}–${scenario.maxPlayers ?? "?"}`
      : null;

  return (
    <div
      style={{
        background: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius,
        overflow: "hidden",
        minHeight: 360,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      {scenario.imageUrl ? (
        <div style={{ position: "relative" }}>
          <img
            src={scenario.imageUrl}
            alt={scenario.name}
            style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(14,26,36,0.85), rgba(14,26,36,0.10) 60%, rgba(14,26,36,0))",
            }}
          />
        </div>
      ) : (
        <div
          style={{
            height: 180,
            background: theme.colors.surface2,
            borderBottom: `1px solid ${theme.colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.colors.text2,
            fontSize: 13,
          }}
        >
          No image
        </div>
      )}

      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {/* Title */}
        <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: 0.2 }}>
          {scenario.name}
        </div>

        {/* Players */}
        {playersText && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 12,
                color: theme.colors.text,
                background: theme.colors.surface2,
                border: `1px solid ${theme.colors.border}`,
                padding: "6px 10px",
                borderRadius: 999,
              }}
            >
              {playersText}
            </span>
          </div>
        )}

        {/* Description */}
        <div
          style={{
            color: theme.colors.text2,
            fontSize: 13,
            lineHeight: 1.45,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
          }}
        >
          {scenario.description?.trim() ? scenario.description : "No description"}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
          <button
            type="button"
            onClick={() => onStartLive(scenario.id)}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 12,
              border: `1px solid ${theme.colors.gold}`,
              background: theme.colors.gold,
              fontWeight: 800,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = theme.colors.goldHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = theme.colors.gold)}
          >
            Start Live
          </button>

          <button
            type="button"
            onClick={() => onDelete(scenario.id)}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              background: "transparent",
              border: `1px solid rgba(227,91,91,0.5)`,
              color: theme.colors.danger,
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
