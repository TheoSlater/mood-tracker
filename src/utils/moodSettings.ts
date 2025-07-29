import { Theme } from "@mui/material/styles";

export const getMoodSettings = (theme: Theme) => {
  const isDark = theme.palette.mode === "dark";

  return [
    {
      label: "Sad",
      size: 150,
      colors: ["#E6A4D6", isDark ? "#6E4C77" : "#D6A8C7"], // softened pink/lavender
      gradientAngle: 45,
    },
    {
      label: "Worried",
      size: 160,
      colors: ["#FFB5D2", isDark ? "#6B505C" : "#F3C3D4"], // pale pink/rose
      gradientAngle: 45,
    },
    {
      label: "Neutral",
      size: 170,
      colors: ["#FFE873", isDark ? "#66624C" : "#F4DA91"], // warm golden glow
      gradientAngle: 45,
    },
    {
      label: "Happy",
      size: 180,
      colors: ["#CFFF70", isDark ? "#567B3E" : "#B8E66D"], // light lime/pastel green
      gradientAngle: 45,
    },
    {
      label: "Excited",
      size: 190,
      colors: ["#90EE90", isDark ? "#4E7754" : "#B0F2A6"], // light green/neon mint
      gradientAngle: 45,
    },
  ];
};
