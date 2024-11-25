import { useState, useEffect } from "react";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Container,
  Stack,
} from "@mui/material";
import { load } from "@tauri-apps/plugin-store";
import { impactFeedback } from "@tauri-apps/plugin-haptics";

import { lightTheme, darkTheme } from "./theme";
import { moodSettings } from "./utils/moodSettings";
import MoodSlider from "./components/MoodSlider";
import DateControls from "./components/DateControls";
import ThemeToggle from "./components/ThemeToggle";
import MoodCircle from "./components/MoodCircle";
import DeveloperMode from "./components/DeveloperMode"; // Importing DeveloperMode component

const getCurrentDate = () => new Date().toISOString().split("T")[0];

const getPreviousDate = (date: string): string => {
  const currentDate = new Date(date);
  currentDate.setDate(currentDate.getDate() - 1);
  return currentDate.toISOString().split("T")[0];
};

const getNextDate = (date: string): string => {
  const currentDate = new Date(date);
  currentDate.setDate(currentDate.getDate() + 1);
  return currentDate.toISOString().split("T")[0];
};

function App() {
  const [mood, setMood] = useState<number>(2);
  const [darkMode, setDarkMode] = useState<boolean | null>(null);
  const [gradient, setGradient] = useState<string>(moodSettings[mood].gradient);
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());
  const [moodHistory, setMoodHistory] = useState<{ [date: string]: number }>(
    {}
  );
  const [lastHapticInterval, setLastHapticInterval] = useState<number | null>(
    null
  );

  const loadSavedMood = async () => {
    try {
      const store = await load("store.json", { autoSave: false });
      const savedMoodHistory = await store.get<{ [date: string]: number }>(
        "moodHistory"
      );
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

  const handleDaySelect = (index: number) => {
    const newDate = getDateForDay(index); // Convert index to actual date
    setSelectedDate(newDate);
    setMood(moodHistory[newDate] || 2);
    setGradient(moodSettings[moodHistory[newDate] || 2].gradient);
  };

  const getDateForDay = (dayIndex: number): string => {
    const today = new Date();
    const dayDiff = (dayIndex - today.getDay() + 7) % 7;
    today.setDate(today.getDate() - today.getDay() + dayDiff);
    return today.toISOString().split("T")[0];
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

  const handleResetData = async () => {
    try {
      const store = await load("store.json", { autoSave: false });
      await store.set("moodHistory", {});
      await store.save();
      impactFeedback("light");
      alert("Data has been reset");
    } catch (e) {
      console.error("Error resetting data:", e);
    }
  };

const handleDeleteData = async () => {
  try {
    const store = await load("store.json", { autoSave: false });
    await store.clear(); // Clear all data
    await store.save();
    
    impactFeedback("light");
    alert("All data has been deleted");

    // Reload the entire app
    window.location.reload(); // This reloads the app, reflecting the change

  } catch (e) {
    console.error("Error deleting data:", e);
  }
};


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
          <Stack direction={"column"} sx={{ width: "100vw" }}>
            <DateControls
              handleDateChange={handleDateChange}
              mood={mood}
              onDaySelect={handleDaySelect}
              moodHistory={moodHistory}
              setMoodHistory={setMoodHistory}
              selectedDate={selectedDate}
            />
            <Container
              maxWidth="sm"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: (theme) => theme.palette.background.paper,
                padding: 3,
                borderRadius: 3,
                boxShadow: 3,
                width: "100%",
              }}
            >
              <MoodCircle mood={mood} darkMode />
              <MoodSlider
                mood={mood} 
                handleMoodChange={handleMoodChange}
                gradient={gradient}
              />
              <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
              <DeveloperMode
              onResetData={handleResetData}
              onDeleteData={handleDeleteData}
            />
            </Container>
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
