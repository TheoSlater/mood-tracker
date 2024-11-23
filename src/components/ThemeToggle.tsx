import React from "react";
import { IconButton } from "@mui/material";
import { Brightness7, Brightness4 } from "@mui/icons-material";

interface ThemeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ darkMode, onToggle }) => {
  return (
    <IconButton onClick={onToggle}>
      {darkMode ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
};

export default ThemeToggle;
