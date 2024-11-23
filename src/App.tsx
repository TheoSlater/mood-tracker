import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  CssBaseline,
  Slider,
  Button,
  Switch,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./theme";
import { moodSettings } from "./utils/moodSettings";
import ThemeToggle from "./components/ThemeToggle";
import MoodCircle from "./components/MoodCircle";
import { load } from "@tauri-apps/plugin-store";

function App() {
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [mood, setMood] = useState<number>(2);
  const [darkMode, setDarkMode] = useState<boolean | null>(null);
  const [gradient, setGradient] = useState<string>(moodSettings[mood].gradient);
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());
  const [moodHistory, setMoodHistory] = useState<{ [date: string]: number }>(
    {}
  );
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);

  const getPreviousDate = (currentDate: string) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split("T")[0];
  };

  const getNextDate = (currentDate: string) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

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
                theme.palette.mode === "dark"
                  ? "rgba(0, 0, 0, 0.5)"
                  : "rgba(196, 196, 196, 0)",
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

            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}
            >
              <Tooltip title="Previous Day">
                <Button
                  variant="contained"
                  onClick={() => handleDateChange("previous")}
                  disabled={selectedDate === getCurrentDate()}
                >
                  &lt;
                </Button>
              </Tooltip>
              <Tooltip title="Today">
                <Button
                  variant="contained"
                  onClick={() => handleDateChange("today")}
                  sx={{ width: "100px" }}
                  disabled={selectedDate === getCurrentDate()}
                >
                  Today
                </Button>
              </Tooltip>
              {isDeveloperMode && (
                <Tooltip title="Next Day">
                  <Button
                    variant="contained"
                    onClick={() => handleDateChange("next")}
                  >
                    &gt;
                  </Button>
                </Tooltip>
              )}
            </Box>
            <MoodCircle mood={mood} darkMode />
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

            <Box sx={{ mt: 4 }}>
              <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
            </Box>

            <Box sx={{ mt: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isDeveloperMode}
                    onChange={() => setIsDeveloperMode(!isDeveloperMode)}
                  />
                }
                label="Enable Developer Mode"
              />
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
