import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#f5f5f5", // Light background color
      paper: "rgba(255, 255, 255, 0.8)", // Slightly transparent light background for paper components
    },
    text: {
      primary: "#000",
    },
  },
  typography: {
    h6: {
      fontSize: "1.2rem",
    },
    h4: {
      fontSize: "3rem",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "rgba(255, 255, 255, 0.8)", // Slightly transparent background in light mode
          backdropFilter: "blur(10px)", // Apply blur effect
          borderRadius: "8px", // Optional: rounded corners for a better frosted effect
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    background: {
      default: "#121212", // Dark background color
      paper: "rgba(33, 33, 33, 0.4)", // Slightly transparent dark background for paper components
    },
    text: {
      primary: "#fff",
    },
  },
  typography: {
    h6: {
      fontSize: "1.2rem",
    },
    h4: {
      fontSize: "3rem",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "rgba(33, 33, 33, 0.1)", // Slightly transparent background in dark mode
          backdropFilter: "blur(10px)", // Apply blur effect
          borderRadius: "8px", // Optional: rounded corners for a better frosted effect
        },
      },
    },
  },
});

export { lightTheme, darkTheme };
