export default function Modal({ theme, title, onClose, children }) {
  const overlay = {
    position: "fixed",
    inset: 0,
    background: theme.colors.overlay,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const box = {
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: 16,
    width: "min(900px, 95%)",
    maxHeight: "90vh",
    overflow: "auto",
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={box} onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            padding: 16,
            borderBottom: `1px solid ${theme.colors.border}`,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <strong>{title}</strong>
          <button onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: 16 }}>{children}</div>
      </div>
    </div>
  );
}
