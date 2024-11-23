import { useState, useEffect } from "react";
import { Typography, Box, Container, CssBaseline, Slider } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { invoke } from "@tauri-apps/api/core";
import { lightTheme, darkTheme } from "./theme";
import { moodSettings } from "./utils/moodSettings";
import ThemeToggle from "./components/ThemeToggle";
import MoodCircle from "./components/MoodCircle";

function App() {
  const [mood, setMood] = useState(2);
  const [darkMode, setDarkMode] = useState<boolean | null>(null);
  const [gradient, setGradient] = useState(moodSettings[mood].gradient);

  const loadSavedMood = async () => {
    try {
      const savedMood = await invoke("load_mood");
      setMood(savedMood as number);
    } catch (e) {
      console.error("Error loading mood:", e);
    }
  };

  const handleMoodChange = async (value: number) => {
    setMood(value);
    setGradient(moodSettings[value].gradient);
    try {
      await invoke("save_mood", { mood: value });
    } catch (e) {
      console.error("Error saving mood:", e);
    }
  };

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else {
      setDarkMode(false);
    }

    loadSavedMood();
  }, []);

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
          }}
        >
          <Container
            maxWidth="sm"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
            >
              How are you feeling today?
            </Typography>
            <MoodCircle mood={mood} darkMode={darkMode} />{" "}
            {/* Use the MoodCircle component */}
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
              }}
            />
            <Typography
              variant="h6"
              sx={{ mt: 2, fontSize: { xs: "1rem", sm: "1.2rem" } }}
            >
              You are feeling: {moodSettings[mood].label}
            </Typography>
            <Box sx={{ mt: 4 }}>
              <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
