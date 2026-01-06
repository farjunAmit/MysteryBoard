import { texts as t } from "../../texts";

export default function SessionCard({
  session,
  scenario,
  theme,
  onGoToSession,
  onDeleteSession,
}) {
  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        {scenario?.imageUrl ? (
          <img
            src={scenario.imageUrl}
            alt={scenario?.name}
            style={styles.image}
          />
        ) : (
          <div style={styles.noImage}>No Photo</div>
        )}
      </div>

      <div style={styles.content}>
        <h3 style={styles.title}>{scenario?.name || "Loading..."}</h3>

        <div style={styles.phaseSection}>
          <span style={styles.phaseLabel}>Phase:</span>
          <span style={styles.phaseValue}>{session.phase}</span>
        </div>

        <div style={styles.buttonGroup}>
          <button
            onClick={() => onGoToSession(session)}
            style={styles.primaryButton}
          >
            {t.common.actions.go || "Go to Session"}
          </button>
          <button
            onClick={() => onDeleteSession(session.id)}
            style={styles.deleteButton}
          >
            {t.common.actions.delete || "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #1F3448",
    borderRadius: 12,
    backgroundColor: "#162635",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  imageContainer: {
    width: "100%",
    height: 160,
    backgroundColor: "#13212E",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  noImage: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#B8B8B8",
    fontSize: 12,
  },
  content: {
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  title: {
    margin: 0,
    fontSize: 16,
    fontWeight: 800,
    color: "#EDEDED",
  },
  phaseSection: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  phaseLabel: {
    color: "#B8B8B8",
    fontSize: 12,
    fontWeight: 700,
  },
  phaseValue: {
    color: "#C9A24D",
    fontSize: 13,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  buttonGroup: {
    display: "flex",
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #C9A24D",
    backgroundColor: "#C9A24D",
    color: "#0B0F14",
    fontWeight: 800,
    fontSize: 12,
    cursor: "pointer",
  },
  deleteButton: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid rgba(227,91,91,0.5)",
    backgroundColor: "transparent",
    color: "#E35B5B",
    fontWeight: 800,
    fontSize: 12,
    cursor: "pointer",
  },
};