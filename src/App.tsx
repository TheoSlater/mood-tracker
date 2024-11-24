import { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline, Box, Container, Typography } from "@mui/material";
import { load } from "@tauri-apps/plugin-store";
import { impactFeedback } from "@tauri-apps/plugin-haptics";

import { lightTheme, darkTheme } from "./theme";
import { moodSettings } from "./utils/moodSettings";
import MoodSlider from "./components/MoodSlider";
import DateControls from "./components/DateControls";
import ThemeToggle from "./components/ThemeToggle";
import MoodCircle from "./components/MoodCircle";

// Helper functions to get previous and next dates
const getPreviousDate = (currentDate: string) => {
  const date = new Date(currentDate);
  date.setDate(date.getDate() - 1); // Subtract 1 day
  return date.toISOString().split("T")[0];
};

const getNextDate = (currentDate: string) => {
  const date = new Date(currentDate);
  date.setDate(date.getDate() + 1); // Add 1 day
  return date.toISOString().split("T")[0];
};

function App() {
  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  const [mood, setMood] = useState<number>(2);
  const [darkMode, setDarkMode] = useState<boolean | null>(null);
  const [gradient, setGradient] = useState<string>(moodSettings[mood].gradient);
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());
  const [moodHistory, setMoodHistory] = useState<{ [date: string]: number }>({});
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const [lastHapticInterval, setLastHapticInterval] = useState<number | null>(null);

  const loadSavedMood = async () => {
    try {
      const store = await load("store.json", { autoSave: false });
      const savedMoodHistory = await store.get<{ [date: string]: number }>("moodHistory");
      if (savedMoodHistory) {
        setMoodHistory(savedMoodHistory);
        const currentMood = savedMoodHistory[selectedDate] || 2;
        setMood(currentMood);
        setGradient(moodSettings[currentMood].gradient);
      }
    } catch (e) {
      console.error("Error loading mood:", e);
    }
  };

  const handleMoodChange = async (value: number) => {
    setMood(value);
    setGradient(moodSettings[value].gradient);
    const interval = Math.round(value * 100);
    if (interval !== lastHapticInterval) {
      setLastHapticInterval(interval);
      impactFeedback("light");
    }

    const newMoodHistory = { ...moodHistory, [selectedDate]: value };
    setMoodHistory(newMoodHistory);

    try {
      const store = await load("store.json", { autoSave: false });
      await store.set("moodHistory", newMoodHistory);
      await store.save();
    } catch (e) {
      console.error("Error saving mood:", e);
    }
  };

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleDateChange = (direction: "previous" | "today" | "next") => {
    let newDate;
    if (direction === "previous") {
      newDate = getPreviousDate(selectedDate);
    } else if (direction === "next") {
      newDate = getNextDate(selectedDate);
    } else {
      newDate = getCurrentDate();
    }
    setSelectedDate(newDate);
    setMood(moodHistory[newDate] || 2);
    setGradient(moodSettings[moodHistory[newDate] || 2].gradient);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else {
      setDarkMode(false);
    }
    loadSavedMood();
  }, [selectedDate]);

  useEffect(() => {
    if (darkMode !== null) {
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    }
  }, [darkMode]);

  if (darkMode === null) {
    return null;
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100vw",
          height: "100vh",
          background: `linear-gradient(45deg, ${gradient})`,
          transition: "background 3s ease-out",
        }}
      >
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
          <Container
            maxWidth="sm"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.5)" : "rgba(196, 196, 196, 0)",
              borderRadius: 2,
              padding: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
                fontWeight: 600,
                color: (theme) => theme.palette.text.primary,
              }}
            >
              How are you feeling on {selectedDate}?
            </Typography>
              
            <DateControls
              selectedDate={selectedDate}
              handleDateChange={handleDateChange}
              isDeveloperMode={isDeveloperMode}
              setIsDeveloperMode={setIsDeveloperMode}
            />
            <MoodCircle mood={mood} darkMode />
            <MoodSlider mood={mood} handleMoodChange={handleMoodChange} gradient={gradient} />

            <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
