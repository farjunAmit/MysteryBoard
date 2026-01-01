import CharacterCard from "./CharacterCard";

export default function CharactersGrid({ characters, isRevealedAtIndex }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
      {characters.map((c, idx) => (
        <CharacterCard
          key={c.id}
          character={c}
          isRevealed={isRevealedAtIndex(idx)}
        />
      ))}
    </div>
  );
}
