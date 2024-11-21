import React from "react";
import { IconButton } from "@mui/material";
import { Brightness7, Brightness4 } from "@mui/icons-material";

interface ThemeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ darkMode, onToggle }) => {
  return (
    <IconButton
      onClick={onToggle}
      sx={{
        bgcolor: darkMode ? "grey.800" : "grey.200",
        "&:hover": {
          bgcolor: darkMode ? "grey.700" : "grey.300",
        },
        transition: "background-color 0.3s",
      }}
    >
      {darkMode ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
};

export default ThemeToggle;
