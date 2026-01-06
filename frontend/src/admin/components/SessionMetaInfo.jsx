import { texts as t } from "../../texts";

export default function SessionMetaInfo({ sessionName, phase, playerCount, slotsCount }) {
  return (
    <div style={sessionStyles.container}>
      <div style={sessionStyles.card}>
        <strong style={sessionStyles.label}>{t.admin.liveSession.meta.sessionName}:</strong>
        <span style={sessionStyles.value}>{sessionName}</span>
      </div>
      <div style={sessionStyles.card}>
        <strong style={sessionStyles.label}>{t.admin.liveSession.meta.phase}:</strong>
        <span style={sessionStyles.value}>{phase}</span>
      </div>
      <div style={sessionStyles.card}>
        <strong style={sessionStyles.label}>{t.admin.liveSession.meta.players}:</strong>
        <span style={sessionStyles.value}>{playerCount}</span>
      </div>
      <div style={sessionStyles.card}>
        <strong style={sessionStyles.label}>{t.admin.liveSession.meta.slots}:</strong>
        <span style={sessionStyles.value}>{slotsCount}</span>
      </div>
    </div>
  );
}

const sessionStyles = {
  container: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 16,
  },
  card: {
    padding: 12,
    border: "1px solid #1F3448",
    borderRadius: 12,
    backgroundColor: "#13212E",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  label: {
    color: "#B8B8B8",
    fontSize: 12,
    fontWeight: 700,
  },
  value: {
    color: "#EDEDED",
    fontSize: 14,
  },
};
