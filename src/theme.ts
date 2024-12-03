import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4D96FF",
    },
    background: {
      default: "#f8f9fa",
      paper: "rgba(255, 255, 255, 0.9)",
    },
    text: {
      primary: "#2d3436",
      secondary: "#636e72",
    },
  },
  typography: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h6: {
      fontSize: "1.2rem",
      fontWeight: 600,
    },
    h4: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(10px)",
          borderRadius: 16,
          transition: "transform 0.2s ease-in-out",
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4D96FF",
    },
    background: {
      default: "#1a1a1a",
      paper: "rgba(30, 30, 30, 0.9)",
    },
    text: {
      primary: "#ffffff",
    },
  },
  typography: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h6: {
      fontSize: "1.2rem",
      fontWeight: 600,
    },
    h4: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "rgba(30, 30, 30, 0.9)",
          backdropFilter: "blur(10px)",
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(10px)",
          borderRadius: 16,
          transition: "transform 0.2s ease-in-out",
        },
      },
    },
  },
});

export { lightTheme, darkTheme };
