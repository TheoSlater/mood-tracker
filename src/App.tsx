import {
  Box,
  Stack,
  Alert,
  Fade,
  CircularProgress,
  Snackbar,
  Fab,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";

import { AnimatedBlob } from "./components/blob";
import { getMoodSettings } from "./utils/moodSettings";
import DatePicker from "./components/DatePicker";
import { useDayService, useNewDayDetection } from "./hooks/useDayService";
import { useMoodStorage } from "./hooks/useMoodStorage";
import MoodSelector from "./components/MoodSelector"; // New component we'll create
import { Add } from "@mui/icons-material";

export default function App() {
  const theme = useTheme();
  const moodSettings = getMoodSettings(theme);

  const { currentDay } = useDayService(true);
  const { isNewDay } = useNewDayDetection((dayInfo) => {
    console.log("New day detected!", dayInfo);
  });

  const {
    moodsByDate,
    loading: moodLoading,
    error: moodError,
    saveMood,
    getMoodForDate,
  } = useMoodStorage();

  const deadMood = {
    label: "No Mood",
    size: 125,
    colors: ["#888888", "#555555"],
    gradientAngle: 45,
    glowIntensity: 0,
    intensity: 0.05,
    animateGradient: true,
  };

  const [selectedDate, setSelectedDate] = useState<number>(currentDay.date);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  useEffect(() => {
    setSelectedDate(currentDay.date);
  }, [currentDay.date]);

  const currentMoodIndex = getMoodForDate(selectedDate);
  const currentMood =
    currentMoodIndex !== undefined ? moodSettings[currentMoodIndex] : deadMood;

  const handleMoodSelect = async (moodIndex: number) => {
    try {
      setSaveStatus("saving");

      // Create date object for the selected date
      const selectedDateObj = new Date();
      selectedDateObj.setDate(selectedDate);

      await saveMood(selectedDateObj, moodIndex);

      setSaveStatus("success");
      setShowMoodSelector(false);

      // Reset status after 2 seconds
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Failed to save mood:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleBlobClick = () => {
    setShowMoodSelector(true);
  };

  if (moodLoading) {
    return (
      <Box
        sx={{
          height: "100dvh",
          width: "100vw",
          backgroundColor: theme.palette.background.default,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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

      {moodError && (
        <Alert
          severity="error"
          sx={{
            position: "absolute",
            top: 80,
            zIndex: 1000,
            minWidth: 200,
          }}
        >
          Error loading moods: {moodError}
        </Alert>
      )}

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
        {currentMoodIndex !== undefined && (
          <Box sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
            Hit the button at the bottom to track your mood for today!
          </Box>
        )}
      </Stack>

      {showMoodSelector && (
        <MoodSelector
          open={showMoodSelector}
          onClose={() => setShowMoodSelector(false)}
          onSelectMood={handleMoodSelect}
          moodSettings={moodSettings}
          currentMoodIndex={currentMoodIndex}
          saving={saveStatus === "saving"}
          onOpen={() => setShowMoodSelector(true)}
        />
      )}

      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          p: 1,
        }}
      >
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleBlobClick}
          sx={{
            width: 68,
            height: 68,
          }}
        >
          <Add />
        </Fab>
      </Box>

      <Snackbar
        open={saveStatus === "success"}
        autoHideDuration={2000}
        message="Mood saved successfully!"
      />

      <Snackbar
        open={saveStatus === "error"}
        autoHideDuration={3000}
        message="Failed to save mood. Please try again."
      />
    </Box>
  );
}
