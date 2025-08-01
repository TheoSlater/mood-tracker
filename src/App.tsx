import {
  Box,
  Alert,
  Fade,
  CircularProgress,
  Snackbar,
  Fab,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";

import { AnimatedBlob } from "./components/blob";
import { getMoodSettings } from "./utils/moodSettings";
import DatePicker from "./components/DatePicker";
import { useDayService, useNewDayDetection } from "./hooks/useDayService";
import { useMoodStorage } from "./hooks/useMoodStorage";
import MoodSelector from "./components/MoodSelector";
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

  const noMood = {
    label: "",
    size: 150,
    colors: ["#333333"],
    gradientAngle: 0,
    glowIntensity: 0,
    intensity: 0,
    animateGradient: false,
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
    currentMoodIndex !== undefined ? moodSettings[currentMoodIndex] : noMood;

  const handleMoodSelect = async (moodIndex: number) => {
    try {
      setSaveStatus("saving");

      const selectedDateObj = new Date();
      selectedDateObj.setDate(selectedDate);

      await saveMood(selectedDateObj, moodIndex);

      setSaveStatus("success");
      setShowMoodSelector(false);

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
          height: "100vh",
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
        height: "100vh",
        width: "100vw",
        backgroundColor: theme.palette.background.default,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Top alerts */}
      <Fade in={isNewDay}>
        <Alert
          severity="info"
          sx={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxWidth: 400,
            zIndex: 1000,
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
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxWidth: 400,
            zIndex: 1000,
          }}
        >
          Error loading moods: {moodError}
        </Alert>
      )}

      {/* Date picker pinned to top */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 480,
          px: 2,
          pt: 2,
          mx: "auto",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <DatePicker
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          moodsByDate={moodsByDate}
          moodSettings={moodSettings}
        />
      </Box>

      {/* Centered mood display */}
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: "80vw",
            maxHeight: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AnimatedBlob
            size={currentMood.size}
            colors={currentMood.colors}
            gradientAngle={currentMood.gradientAngle}
            intensity={0.25}
            animateGradient
            glowIntensity={6}
          />
        </Box>

        <Typography variant="h6" sx={{ mt: 2 }}>
          {currentMood.label}
        </Typography>

        {currentMoodIndex === undefined && (
          <Typography
            variant="caption"
            sx={{ mt: 1, color: "text.secondary", maxWidth: 300 }}
          >
            Hit the button at the bottom to track your mood for today!
          </Typography>
        )}
      </Box>

      {/* Mood selector modal */}
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

      {/* Add mood button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          p: 1,
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          alignItems: "center",
        }}
      >
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleBlobClick}
          sx={{
            width: { xs: 56, sm: 68 },
            height: { xs: 56, sm: 68 },
          }}
        >
          <Add />
        </Fab>
        <Typography
          variant="caption"
          sx={{
            mt: 1,
            color: "text.secondary",
            fontSize: { xs: "0.7rem", sm: "0.75rem" },
          }}
        >
          Add mood
        </Typography>
      </Box>

      {/* Save feedback */}
      <Snackbar
        open={saveStatus === "success"}
        autoHideDuration={2000}
        message="Mood saved successfully!"
        ContentProps={{
          sx: {
            maxWidth: "90vw",
            whiteSpace: "pre-line",
          },
        }}
      />

      <Snackbar
        open={saveStatus === "error"}
        autoHideDuration={3000}
        message="Failed to save mood. Please try again."
        ContentProps={{
          sx: {
            maxWidth: "90vw",
            whiteSpace: "pre-line",
          },
        }}
      />
    </Box>
  );
}
