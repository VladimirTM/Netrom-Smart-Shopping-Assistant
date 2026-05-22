import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      light: "#D4C200",
      main: "#B5A000",
      dark: "#7A7000",
      contrastText: "#1a1a00",
    },
    secondary: {
      light: "#E8B840",
      main: "#C88000",
      dark: "#8A5800",
      contrastText: "#ffffff",
    },
    success: {
      main: "#5A7A00",
      contrastText: "#ffffff",
    },
    background: {
      default: "#FAFAF2",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2C2800",
      secondary: "#6E6800",
    },
    divider: "#D4C890",
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
  },
});

export default theme;
