import { Box, Stack, Alert, Fade } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";

import { AnimatedBlob } from "./components/blob";
import { getMoodSettings } from "./utils/moodSettings";
import DatePicker from "./components/DatePicker";
import { useDayService, useNewDayDetection } from "./hooks/useDayService";

export default function App() {
  const theme = useTheme();
  const moodSettings = getMoodSettings(theme);

  const { currentDay } = useDayService(true);
  const { isNewDay } = useNewDayDetection((dayInfo) => {
    console.log("New day detected!", dayInfo);
  });

  const deadMood = {
    label: "No Mood",
    size: 125,
    colors: ["#888888", "#444444"],
    gradientAngle: 0,
    glowIntensity: 0,
    intensity: 0.05,
    animateGradient: false,
  };

  const [selectedDate, setSelectedDate] = useState<number>(currentDay.date);

  useEffect(() => {
    setSelectedDate(currentDay.date);
  }, [currentDay.date]);

  const [moodsByDate] = useState<Record<number, number>>({});
  const currentMoodIndex = moodsByDate[selectedDate];
  const currentMood =
    currentMoodIndex !== undefined ? moodSettings[currentMoodIndex] : deadMood;

  return (
    <Box
      sx={{
        height: "100dvh",
        width: "100vw",
        backgroundColor: theme.palette.background.default,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Fade in={isNewDay}>
        <Alert
          severity="info"
          sx={{
            position: "absolute",
            top: 20,
            zIndex: 1000,
            minWidth: 200,
          }}
        >
          Welcome to {currentDay.dayName}! How are you feeling today?
        </Alert>
      </Fade>

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

          <Box sx={{ mt: 2, fontSize: "0.8rem", color: "text.secondary" }}>
            Today: {currentDay.dayName}, {currentDay.date}/{currentDay.month}/
            {currentDay.year}
          </Box>
        </Stack>
      )}
    </Box>
  );
}
