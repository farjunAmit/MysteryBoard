import { texts } from "../../texts";

export default function CharacterCard({ character, isRevealed }) {
  return (
    <div
      style={{
        width: "100%",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 12,
        background: "white",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {/* Avatar */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: "#f3f4f6",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            color: "#6b7280",
            flexShrink: 0,
          }}
        >
          {isRevealed &&
            (character.photoUrl ? (
              <img
                src={character.photoUrl}
                alt={character.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span>{texts.client.characterCard.noPhoto}</span>
            ))}
        </div>

        {/* Name + hint */}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>
            {isRevealed
              ? character.name
              : texts.client.characterCard.hiddenCharacterName}
          </div>

          {isRevealed && character.roleHint && (
            <div style={{ fontSize: 13, color: "#6b7280" }}>
              {character.roleHint}
            </div>
          )}
        </div>
      </div>

      {isRevealed &&
        Array.isArray(character.traits) &&
        character.traits.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <ul style={{ margin: 0, paddingInlineStart: 18 }}>
              {character.traits.map((trait, idx) => (
                <li key={idx} style={{ fontSize: 14, marginBottom: 4 }}>
                  {trait}
                </li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
}
