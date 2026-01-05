export const adminTheme = {
  colors: {
    bg: "#0E1A24",
    surface: "#162635",
    surface2: "#13212E",
    border: "#1F3448",
    text: "#EDEDED",
    text2: "#B8B8B8",
    gold: "#C9A24D",
    goldHover: "#B08C3A",
    overlay: "rgba(0,0,0,0.55)",
    danger: "#E35B5B",
  },
  radius: 14,
  shadow: "0 10px 30px rgba(0,0,0,0.35)",
  font: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
};

export function createAdminStyles(theme) {
  return {
    page: {
      minHeight: "100vh",
      background: theme.colors.bg,
      color: theme.colors.text,
      fontFamily: theme.font,
      padding: 24,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    title: {
      margin: 0,
      fontSize: 28,
    },
    buttonPrimary: {
      padding: "10px 16px",
      borderRadius: 12,
      border: `1px solid ${theme.colors.gold}`,
      background: theme.colors.gold,
      color: "#0B0F14",
      fontWeight: 700,
      cursor: "pointer",
    },
    sectionTitle: {
      margin: "24px 0 12px",
      fontSize: 16,
      color: theme.colors.text2,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: 16,
    },
    error: {
      marginTop: 12,
      padding: 12,
      borderRadius: 12,
      border: `1px solid rgba(227,91,91,0.35)`,
      background: "rgba(227,91,91,0.08)",
    },
  };
}
