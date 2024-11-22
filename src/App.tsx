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
import { motion } from "framer-motion";
import { lightTheme, darkTheme } from "./theme";
import { invoke } from "@tauri-apps/api/core";

const moodSettings = [
  {
    color: "#D16BA5",
    size: 150,
    label: "Sad",
    gradient: "rgba(209, 107, 165, 0.8), rgba(255, 255, 255, 0.2)",
  },
  {
    color: "#FF94C2",
    size: 160,
    label: "Worried",
    gradient: "rgba(255, 148, 194, 0.8), rgba(255, 255, 255, 0.2)",
  },
  {
    color: "#FFD700",
    size: 170,
    label: "Neutral",
    gradient: "rgba(255, 215, 0, 0.8), rgba(255, 255, 255, 0.2)",
  },
  {
    color: "#ADFF2F",
    size: 180,
    label: "Happy",
    gradient: "rgba(173, 255, 47, 0.8), rgba(255, 255, 255, 0.2)",
  },
  {
    color: "#32CD32",
    size: 190,
    label: "Excited",
    gradient: "rgba(50, 205, 50, 0.8), rgba(255, 255, 255, 0.2)",
  },
  {
    color: "#00BFFF",
    size: 200,
    label: "Calm",
    gradient: "rgba(0, 191, 255, 0.8), rgba(255, 255, 255, 0.2)",
  },
  {
    color: "#FF6347",
    size: 210,
    label: "Angry",
    gradient: "rgba(255, 99, 71, 0.8), rgba(255, 255, 255, 0.2)",
  },
  {
    color: "#8A2BE2",
    size: 220,
    label: "Confident",
    gradient: "rgba(138, 43, 226, 0.8), rgba(255, 255, 255, 0.2)",
  },
  {
    color: "#F0E68C",
    size: 230,
    label: "Relaxed",
    gradient: "rgba(240, 230, 140, 0.8), rgba(255, 255, 255, 0.2)",
  },
];

function App() {
  const [mood, setMood] = useState(4);
  const [darkMode, setDarkMode] = useState(false);
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
    }
    loadSavedMood();
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
          textAlign: "center",
          flexDirection: "column",
          px: { xs: 2, sm: 3 },
          py: { xs: 3, sm: 4 },
          background: `linear-gradient(45deg, ${gradient})`,
          transition: "background 3s ease-out",
        }}
      >
        <Container
          maxWidth="sm"
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
          <motion.div
            style={{
              borderRadius: "50%",
              marginTop: "5px",
              boxShadow: darkMode
                ? `0 0 20px ${moodSettings[mood].color}`
                : "none",
            }}
            animate={{
              backgroundColor: moodSettings[mood].color,
              width: moodSettings[mood].size,
              height: moodSettings[mood].size,
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
          />

          <Slider
            value={mood}
            min={0}
            max={8}
            step={1}
            marks
            onChange={(_event, value) => handleMoodChange(value as number)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => moodSettings[value].label}
            sx={{
              width: "80%",
              maxWidth: 400,
              mt: 4,
              mx: "auto",
              "& .MuiSlider-thumb": {
                transition: "transform 0.3s ease",
              },
              "& .MuiSlider-rail": {
                opacity: 0.3,
              },
              "& .MuiSlider-track": {
                transition: "width 0.3s ease",
              },
            }}
          />

          <Typography
            variant="h6"
            sx={{ mt: 2, fontSize: { xs: "1rem", sm: "1.2rem" } }}
          >
            You are feeling: {moodSettings[mood].label}
          </Typography>

          <Box sx={{ mt: 4 }}>
            <IconButton
              onClick={toggleTheme}
              sx={{ fontSize: { xs: 30, sm: 40 } }}
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
