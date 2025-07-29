import { createTheme } from "@mui/material/styles";

// Extend the theme interface to include custom date picker colors
declare module "@mui/material/styles" {
  interface Palette {
    datePicker: {
      background: string;
      border: string;
      selectedBackground: string;
      hoverBackground: string;
      dayLabel: string;
      dateNumber: string;
      selectedDateNumber: string;
    };
  }

  interface PaletteOptions {
    datePicker?: {
      background?: string;
      border?: string;
      selectedBackground?: string;
      hoverBackground?: string;
      dayLabel?: string;
      dateNumber?: string;
      selectedDateNumber?: string;
    };
  }
}

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
    datePicker: {
      background: "#ffffff",
      border: "#e0e0e0",
      selectedBackground: "#e3f2fd",
      hoverBackground: "#f5f5f5",
      dayLabel: "#666666",
      dateNumber: "#000000",
      selectedDateNumber: "#1976d2",
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
    datePicker: {
      background: "#2d2d2d",
      border: "#404040",
      selectedBackground: "#4a4a4a",
      hoverBackground: "#3a3a3a",
      dayLabel: "#b0b0b0",
      dateNumber: "#ffffff",
      selectedDateNumber: "#90caf9",
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
