import React from "react";
import { Slider, Typography } from "@mui/material";
import { moodSettings } from "../utils/moodSettings"; 

interface MoodSliderProps {
  mood: number;
  handleMoodChange: (value: number) => void;
  gradient: string;
}

const MoodSlider: React.FC<MoodSliderProps> = ({ mood, handleMoodChange }) => (
  <>
    <Slider
      value={mood}
      min={0}
      max={moodSettings.length - 1}
      step={1}
      onChange={(_event, value) => handleMoodChange(value as number)}
      sx={{
        width: "80%",
        maxWidth: 400,
        mt: 4,
        mx: "auto",
        color: (theme) =>
          theme.palette.mode === "dark"
            ? theme.palette.secondary.main
            : theme.palette.primary.main,
      }}
    />
    <Typography
      variant="h6"
      sx={{
        mt: 2,
        fontSize: { xs: "1rem", sm: "1.2rem" },
        color: (theme) => theme.palette.text.primary,
      }}
    >
      You are feeling: {moodSettings[mood].label}
    </Typography>
  </>
);

export default MoodSlider;
