import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Container,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import DateControls from "./components/DateControls";
import MoodCircle from "./components/MoodCircle";
import SettingsButton from "./components/Settings/SettingsButton";
import SettingsDialog from "./components/Settings/SettingsDialog";
import AddMoodButton from "./components/MoodWizard/AddMoodButton";
import MoodWizard from "./components/MoodWizard/MoodWizard";
import MoodMenu from "./components/MoodMenu";
import { OnboardingFlow } from "./components/Onboarding/OnboardingFlow";
import { TourGuide } from "./components/TourGuide/TourGuide";
import { useTour } from "./components/TourGuide/useTour";
import { getTourSteps } from "./components/TourGuide/tourSteps";
import { useMood } from "./hooks/useMood";
import { useTheme } from "./hooks/useTheme";
import { useDate } from "./hooks/useDate";

function App() {
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );
  const { selectedDate, handleDateChange, getDateForDay, getCurrentDate } =
    useDate();
  const {
    mood,
    emotions: currentEmotions,
    gradient,
    moodHistory,
    handleMoodChange,
    handleEmotionsChange,
    deleteData,
    isMoodLoaded,
  } = useMood(selectedDate);
  const { darkMode, toggleTheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [devMode, setDevMode] = useState(
    () => localStorage.getItem("devMode") === "true"
  );
  const {
    showTour,
    handleTourComplete,
    handleTourSkip,
    resetTour,
    setShowTour,
  } = useTour();

  const isMobile = useMediaQuery("(max-width:600px)");

  const handleOnboardingComplete = (name: string) => {
    localStorage.setItem("username", name);
    setUsername(name);
    setShowTour(true);
  };

  const handleToggleDevMode = () => {
    const newDevMode = !devMode;
    localStorage.setItem("devMode", String(newDevMode));
    setDevMode(newDevMode);
  };

  const handleResetIntro = () => {
    localStorage.removeItem("username");
    setUsername(null);
    setSettingsOpen(false);
    resetTour();
  };

  useEffect(() => {
    const tourCompleted = localStorage.getItem("tourCompleted");
    if (username && !tourCompleted) {
      setShowTour(true);
    }
  }, [username, setShowTour]);

  useEffect(() => {
    if (showTour) {
      localStorage.setItem("tourCompleted", "false");
    }
  }, [showTour]);

  useEffect(() => {
    const tourCompleted = localStorage.getItem("tourCompleted");
    if (tourCompleted === "true") {
      setShowTour(false);
    }
  }, []);

  if (!isMoodLoaded) {
    return <div>Loading...</div>;
  }

  const handleWizardComplete = (data: { mood: number; emotions: string[] }) => {
    handleMoodChange(data.mood);
    handleEmotionsChange(data.emotions);
    setWizardOpen(false);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setWizardOpen(true);
  };

  const moodDescription =
    mood === null
      ? "Unknown"
      : mood < 2
      ? "Unpleasant"
      : mood > 2
      ? "Pleasant"
      : "Neutral";

  const tourSteps = username ? getTourSteps(username) : [];

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100vw",
          height: "100vh",
          background: `linear-gradient(135deg, ${gradient})`,
          transition: "background 1.5s ease",
        }}
      >
        <AnimatePresence mode="wait">
          {!username ? (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OnboardingFlow onComplete={handleOnboardingComplete} />
            </motion.div>
          ) : (
            <motion.div
              key="main-app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: "100%", height: "100%" }}
            >
              <SettingsButton
                id="settings-button"
                onClick={() => setSettingsOpen(true)}
              />
              <SettingsDialog
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                darkMode
                devMode={devMode}
                onToggleTheme={toggleTheme}
                onToggleDevMode={handleToggleDevMode}
                onDeleteData={deleteData}
                onResetIntro={handleResetIntro}
              />
              <MoodWizard
                open={wizardOpen}
                onClose={() => {
                  setWizardOpen(false);
                  setIsEditing(false);
                }}
                onComplete={handleWizardComplete}
                initialMood={isEditing ? mood ?? 2 : 2}
                initialEmotions={currentEmotions}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                  padding: { xs: 2, sm: 4 },
                }}
              >
                <Stack direction="column" sx={{ width: "100%" }}>
                  <Container maxWidth="sm">
                    <Box
                      id="date-controls"
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <DateControls
                        selectedDate={selectedDate}
                        moodHistory={moodHistory}
                        onDateChange={handleDateChange}
                        getDateForDay={getDateForDay}
                        getCurrentDate={getCurrentDate}
                      />
                    </Box>
                    <Container
                      maxWidth="sm"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: (theme) =>
                          theme.palette.background.paper,
                        padding: { xs: 2, sm: 3 },
                        borderRadius: 3,
                        boxShadow: 3,
                        position: "relative",
                      }}
                    >
                      <Typography
                        id="welcome-message"
                        variant={isMobile ? "h6" : "h5"}
                        sx={{
                          mb: 3,
                          fontWeight: "bold",
                          textAlign: "center",
                          color: (theme) => theme.palette.text.primary,
                        }}
                      >
                        Welcome back, {username}! 👋
                      </Typography>
                      <Box id="mood-display">
                        <MoodMenu
                          onEdit={handleEdit}
                          disabled={mood === null}
                        />
                        {mood === null ? (
                          <Box id="add-mood-button">
                            <AddMoodButton
                              onOpenWizard={() => setWizardOpen(true)}
                            />
                          </Box>
                        ) : (
                          <>
                            <MoodCircle mood={mood} darkMode />
                            <Typography
                              variant="h6"
                              sx={{
                                textAlign: "center",
                                mt: 2,
                                color: (theme) => theme.palette.text.primary,
                              }}
                            >
                              {moodDescription}
                            </Typography>
                            {currentEmotions.length > 0 && (
                              <Typography
                                variant="body1"
                                sx={{
                                  textAlign: "center",
                                  mt: 1,
                                  color: (theme) =>
                                    theme.palette.text.secondary,
                                }}
                              >
                                Emotions: {currentEmotions.join(", ")}
                              </Typography>
                            )}
                          </>
                        )}
                      </Box>
                    </Container>
                  </Container>
                </Stack>
              </Box>
              <TourGuide
                steps={tourSteps}
                isOpen={showTour}
                onComplete={handleTourComplete}
                onSkip={handleTourSkip}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </ThemeProvider>
  );
}

export default App;
