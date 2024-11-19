import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2", // Primary color for light mode
    },
    background: {
      default: "#f5f5f5", // Light background color
    },
    text: {
      primary: "#000", // Text color for light mode
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
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9", // Primary color for dark mode
    },
    background: {
      default: "#121212", // Dark background color for dark mode
    },
    text: {
      primary: "#fff", // Text color for dark mode
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
});

export { lightTheme, darkTheme };
