import { createTheme } from "@mui/material";

export function createAppTheme(mode: "light" | "dark") {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: {
        light: "#D4C200",
        main: "#B5A000",
        // In dark mode, use the lighter golden so price text has ~6:1 contrast on dark paper
        dark: isDark ? "#D4C200" : "#7A7000",
        contrastText: "#1a1a00",
      },
      secondary: {
        light: "#E8B840",
        main: "#C88000",
        dark: isDark ? "#E8B840" : "#8A5800",
        contrastText: "#ffffff",
      },
      success: {
        // #5A7A00 is too dark (~3:1) on the dark paper; use a brighter green in dark mode
        main: isDark ? "#8BC34A" : "#5A7A00",
        contrastText: isDark ? "#1a1a00" : "#ffffff",
      },
      background: isDark
        ? { default: "#141408", paper: "#1e1e0e" }
        : { default: "#FAFAF2", paper: "#FFFFFF" },
      text: isDark
        ? { primary: "#EDE8B0", secondary: "#B8B06A" }
        : { primary: "#2C2800", secondary: "#6E6800" },
      divider: isDark ? "#3a3818" : "#D4C890",
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: "system-ui, sans-serif",
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      h5: { fontWeight: 600 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: isDark ? {
            border: "1px solid #3a3818",
          } : {},
        },
      },
      MuiChip: {
        styleOverrides: {
          root: isDark ? {
            borderColor: "#3a3818",
          } : {},
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: isDark ? {
            borderColor: "#3a3818",
          } : {},
        },
      },
    },
  });
}

export default createAppTheme("light");
