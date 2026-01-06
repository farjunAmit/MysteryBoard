import { useMemo, useState } from "react";
import { texts as t } from "../../texts";

function getRevealedTraitsForCharacter(events, characterId) {
  return (events || [])
    .filter(
      (e) =>
        e.type === "trait_revealed" &&
        String(e.characterId) === String(characterId)
    )
    .map((e) => e.text);
}

export default function CharacterCard({
  character,
  slot,
  events,
  onRevealTrait,
}) {
  const [selectedTrait, setSelectedTrait] = useState("");

  const revealedTraits = useMemo(
    () => getRevealedTraitsForCharacter(events, character._id),
    [events, character._id]
  );

  const remainingTraits = useMemo(() => {
    const all = character?.traits || [];
    return all.filter((trait) => !revealedTraits.includes(trait));
  }, [character?.traits, revealedTraits]);

  return (
    <div style={styles.card}>
      <h3 style={styles.characterName}>{character.name}</h3>

      {slot?.photoUrl && (
        <img src={slot.photoUrl} alt={character.name} style={styles.photo} />
      )}

      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>{t.admin.characterCard.revealedTraits}</h4>

        {revealedTraits.length === 0 ? (
          <p style={styles.emptyMessage}>{t.admin.characterCard.noTraitsRevealed}</p>
        ) : (
          <ul style={styles.traitsList}>
            {revealedTraits.map((tr, idx) => (
              <li key={idx} style={styles.traitItem}>{tr}</li>
            ))}
          </ul>
        )}
      </div>

      <div style={styles.section}>
        <select
          value={selectedTrait}
          onChange={(e) => setSelectedTrait(e.target.value)}
          disabled={remainingTraits.length === 0}
          style={styles.select}
        >
          <option value="">
            {remainingTraits.length === 0
              ? t.admin.characterCard.noTraitsLeft
              : t.admin.characterCard.selectTraitPlaceholder}
          </option>

          {remainingTraits.map((tr) => (
            <option key={tr} value={tr}>
              {tr}
            </option>
          ))}
        </select>

        <button
          type="button"
          disabled={!selectedTrait || !onRevealTrait}
          onClick={() => {
            onRevealTrait?.(character._id, selectedTrait);
            setSelectedTrait("");
          }}
          style={{
            ...styles.revealButton,
            opacity: !selectedTrait || !onRevealTrait ? 0.55 : 1,
            cursor: !selectedTrait || !onRevealTrait ? "not-allowed" : "pointer",
          }}
        >
          {t.admin.characterCard.reveal}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    padding: 14,
    border: "1px solid #1F3448",
    borderRadius: 12,
    backgroundColor: "#162635",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  characterName: {
    margin: 0,
    fontSize: 16,
    fontWeight: 800,
    color: "#EDEDED",
  },
  photo: {
    width: "100%",
    height: 200,
    objectFit: "cover",
    borderRadius: 10,
    border: "1px solid #1F3448",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  sectionTitle: {
    margin: 0,
    fontSize: 12,
    fontWeight: 700,
    color: "#B8B8B8",
    textTransform: "uppercase",
  },
  traitsList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  traitItem: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#13212E",
    border: "1px solid #1F3448",
    color: "#EDEDED",
    fontSize: 12,
  },
  emptyMessage: {
    margin: 0,
    fontSize: 12,
    color: "#B8B8B8",
    fontStyle: "italic",
  },
  select: {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #1F3448",
    backgroundColor: "#13212E",
    color: "#EDEDED",
    fontSize: 12,
    cursor: "pointer",
  },
  revealButton: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #C9A24D",
    backgroundColor: "#C9A24D",
    color: "#0B0F14",
    fontWeight: 800,
    fontSize: 12,
    cursor: "pointer",
  },
};
