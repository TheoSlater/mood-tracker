import { useState, useEffect } from "react";
import {
  IconButton,
  Slider,
  Typography,
  Box,
  Container,
  CssBaseline,
} from "@mui/material";
import { Brightness7, Brightness4 } from "@mui/icons-material";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./theme";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [mood, setMood] = useState(3);
  const [darkMode, setDarkMode] = useState(false);

  const moods = ["😢", "😟", "😐", "😊", "😁"];

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
    }
    loadSavedMood();
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
          flexDirection: "column",
          px: { xs: 2, sm: 3 },
          py: { xs: 3, sm: 4 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
          >
            How are you feeling today?
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "3rem", sm: "4rem" },
              mt: 2,
            }}
          >
            {moods[mood]}
          </Typography>
          <Slider
            value={mood}
            min={0}
            max={4}
            step={1}
            marks
            onChange={(_event, value) => handleMoodChange(value as number)}
            sx={{
              width: "80%",
              maxWidth: 400,
              mt: 2,
              mx: "auto",
            }}
          />
          <Box sx={{ mt: 2 }}>
            <IconButton
              onClick={toggleTheme}
              sx={{ fontSize: { xs: 30, sm: 40 } }}
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
