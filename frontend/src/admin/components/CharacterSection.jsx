import { useMemo } from "react";
import { adminTheme, createAdminStyles } from "../ui/adminTheme";
import OptionalCharactersList from "./OptionalCharactersList";
import { texts as t } from "../../texts";

export default function CharacterSection({ scenario, session, canAddMore, onAddCharacter }) {
  const theme = adminTheme;
  const styles = useMemo(() => createAdminStyles(theme), []);

  return (
    <div style={charStyles.container}>
      <div style={charStyles.card}>
        <strong style={charStyles.title}>{t.admin.liveSession.characters.mandatory}</strong>
        <ul style={charStyles.list}>
          {(scenario.characters || [])
            .filter((c) => c.required)
            .map((c) => (
              <li key={c._id} style={charStyles.listItem}>{c.name}</li>
            ))}
        </ul>
      </div>

      <div style={charStyles.card}>
        <strong style={charStyles.title}>{t.admin.liveSession.characters.optional}</strong>
        <OptionalCharactersList
          characters={scenario.characters}
          slots={session.slots}
          canAddMore={canAddMore}
          onAddCharacter={onAddCharacter}
        />
      </div>
    </div>
  );
}

const charStyles = {
  container: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 16,
  },
  card: {
    flex: 1,
    minWidth: 240,
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
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  listItem: {
    color: "#EDEDED",
    fontSize: 13,
    padding: "6px 0",
  },
};
