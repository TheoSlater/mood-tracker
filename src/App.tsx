import { Box, Slider, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { AnimatedBlob } from "./components/blob";
import { getMoodSettings } from "./utils/moodSettings";
import DatePicker from "./components/DatePicker";

export default function App() {
  const theme = useTheme();
  const moodSettings = getMoodSettings(theme);

  const deadMood = {
    label: "No Mood",
    size: 140,
    colors: ["#888888", "#444444"], // muted greys
    gradientAngle: 0,
    glowIntensity: 0,
    intensity: 0.05,
    animateGradient: false,
  };
  // Track selected date (day number of current week)
  const [selectedDate, setSelectedDate] = useState<number>(
    new Date().getDate()
  );

  // Map of date (day number) to mood index
  // Start with Neutral for all or empty and fallback later
  const [moodsByDate, setMoodsByDate] = useState<Record<number, number>>({});

  // Get current mood for the selected date or fallback to Neutral (index 2)
  const currentMoodIndex = moodsByDate[selectedDate];
  const currentMood =
    currentMoodIndex !== undefined ? moodSettings[currentMoodIndex] : deadMood;

  // Slider changes mood for selected date
  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    const index = Array.isArray(newValue) ? newValue[0] : newValue;
    setMoodsByDate((prev) => ({
      ...prev,
      [selectedDate]: index,
    }));
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        width: "100dvw",
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {currentMood && (
        <Stack direction="column" spacing={2} alignItems="center">
          <DatePicker
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            moodsByDate={moodsByDate}
            moodSettings={moodSettings}
          />
          <AnimatedBlob
            size={currentMood.size}
            colors={currentMood.colors}
            gradientAngle={currentMood.gradientAngle}
            intensity={0.25}
            animateGradient
            glowIntensity={6}
          />
          <p>{currentMood.label}</p>
          <Slider
            value={currentMoodIndex}
            min={0}
            max={moodSettings.length - 1}
            step={1}
            aria-label="Mood"
            valueLabelDisplay="off"
            sx={{ width: 300 }}
            onChange={handleSliderChange}
          />
        </Stack>
      )}
    </Box>
  );
}
