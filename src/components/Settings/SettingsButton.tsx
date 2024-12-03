import { IconButton } from "@mui/material";
import { Settings } from "lucide-react";

interface SettingsButtonProps {
  onClick: () => void;
  id?: string;
}

const SettingsButton = ({ onClick, id }: SettingsButtonProps) => {
  return (
    <IconButton
      id={id}
      onClick={onClick}
      sx={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 1000,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(8px)",
        "&:hover": {
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.2)"
              : "rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <Settings size={24} />
    </IconButton>
  );
};

export default SettingsButton;
