import { useMemo } from "react";
import { adminTheme, createAdminStyles } from "../ui/adminTheme";
import OptionalCharactersList from "./OptionalCharactersList";
import { texts as t } from "../../texts";

export default function GroupsSection({ scenario, session, canAddMore, onAddCharacter }) {
  const theme = adminTheme;
  const styles = useMemo(() => createAdminStyles(theme), []);

  return (
    <div style={groupStyles.container}>
      <strong style={groupStyles.title}>{t.admin.liveSession.characters.optional}</strong>

      <div style={groupStyles.groupsList}>
        {(scenario.groups || []).map((group) => (
          <div key={group._id} style={groupStyles.groupCard}>
            <h4 style={groupStyles.groupName}>{group.name}</h4>
            {group.sharedInfo && (
              <p style={groupStyles.groupInfo}>{group.sharedInfo}</p>
            )}

            <OptionalCharactersList
              characters={group.characters}
              slots={session.slots}
              canAddMore={canAddMore}
              onAddCharacter={onAddCharacter}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const groupStyles = {
  container: {
    marginBottom: 16,
    padding: 14,
    border: "1px solid #1F3448",
    borderRadius: 12,
    backgroundColor: "#162635",
  },
  title: {
    display: "block",
    marginBottom: 12,
    color: "#B8B8B8",
    fontSize: 13,
    fontWeight: 700,
  },
  groupsList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  groupCard: {
    padding: 12,
    border: "1px solid #1F3448",
    borderRadius: 10,
    backgroundColor: "#13212E",
  },
  groupName: {
    margin: "0 0 4px 0",
    fontSize: 14,
    fontWeight: 800,
    color: "#EDEDED",
  },
  groupInfo: {
    margin: "0 0 8px 0",
    fontSize: 11,
    color: "#B8B8B8",
    fontStyle: "italic",
  },
};
