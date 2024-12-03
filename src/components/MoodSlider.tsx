import { useEffect, useState } from "react";
import { Slider, Typography, Box } from "@mui/material";
import { moodSettings } from "../utils/moodSettings";
import { impactFeedback } from "@tauri-apps/plugin-haptics";

interface MoodSliderProps {
  mood: number;
  handleMoodChange: (value: number) => void;
}

export default function MoodSlider({
  mood,
  handleMoodChange,
}: MoodSliderProps) {
  const [lastValue, setLastValue] = useState(mood);

  useEffect(() => {
    setLastValue(mood);
  }, [mood]);

  const handleChange = (_event: Event, value: number | number[]) => {
    const newValue = value as number;
    if (newValue !== lastValue) {
      impactFeedback("light");
      setLastValue(newValue);
    }
    handleMoodChange(newValue);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 400, mt: 4 }}>
      <Slider
        value={mood}
        min={0}
        max={moodSettings.length - 1}
        step={1}
        onChange={handleChange}
        sx={{
          width: "100%",
          height: 8,
          "& .MuiSlider-thumb": {
            width: 24,
            height: 24,
            "&.Mui-active": {
              width: 32,
              height: 32,
            },
          },
          "& .MuiSlider-rail": {
            opacity: 0.28,
          },
        }}
      />
      <Typography
        variant="h6"
        sx={{
          mt: 3,
          textAlign: "center",
          fontSize: { xs: "1.1rem", sm: "1.3rem" },
          fontWeight: 500,
          color: (theme) => theme.palette.text.primary,
        }}
      >
        {moodSettings[mood].label}
      </Typography>
    </Box>
  );
}
