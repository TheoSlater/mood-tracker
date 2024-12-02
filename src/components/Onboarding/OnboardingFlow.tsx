import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Sparkles, Heart, LineChart, User } from "lucide-react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { OnboardingStep } from "./OnboardingStep";

interface OnboardingFlowProps {
  onComplete: (username: string) => void;
}

const steps = [
  {
    icon: <Sparkles style={{ width: 32, height: 32, strokeWidth: 1.5 }} />,
    title: "Welcome to MoodTracker",
    description:
      "Your personal journey to emotional well-being starts here. Track, understand, and improve your daily mood.",
    iconBg: "primary.light",
    iconColor: "primary.main",
  },
  {
    icon: <Heart style={{ width: 32, height: 32, strokeWidth: 1.5 }} />,
    title: "Track Your Emotions",
    description:
      "Log your daily mood and emotions with just a few taps. It's simple, fast, and meaningful.",
    iconBg: "primary.light",
    iconColor: "primary.main",
  },
  {
    icon: <LineChart style={{ width: 32, height: 32, strokeWidth: 1.5 }} />,
    title: "Discover Patterns",
    description:
      "Gain insights into your emotional patterns over time and identify what affects your mood.",
    iconBg: "primary.light",
    iconColor: "primary.main",
  },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onComplete(username);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ width: "100%", maxWidth: "32rem", margin: "0 auto" }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          background: theme.palette.background.paper,
          backdropFilter: "blur(10px)",
        }}
      >
        <Box sx={{ position: "relative", height: 260, mb: 4 }}>
          <AnimatePresence mode="wait">
            {currentStep < steps.length ? (
              <OnboardingStep
                key={currentStep}
                {...steps[currentStep]}
                isActive={true}
              />
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                style={{ position: "absolute", top: 0, left: 0, width: "100%" }}
              >
                <Box display="flex" flexDirection="column" alignItems="center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: "50%",
                        background: theme.palette.background.paper,
                        backdropFilter: "blur(10px)",
                        color: theme.palette.primary.main,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 64,
                        height: 64,
                        boxShadow: `0 8px 32px ${
                          theme.palette.mode === "dark"
                            ? "rgba(0, 0, 0, 0.3)"
                            : "rgba(0, 0, 0, 0.1)"
                        }`,
                      }}
                    >
                      <User
                        style={{ width: 32, height: 32, strokeWidth: 1.5 }}
                      />
                    </Paper>
                  </motion.div>
                  <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    One Last Step
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    align="center"
                    sx={{ maxWidth: "sm" }}
                  >
                    Let us know what to call you
                  </Typography>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {currentStep < steps.length ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="row" spacing={1}>
                {steps.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor:
                        index === currentStep
                          ? theme.palette.primary.main
                          : theme.palette.grey[300],
                      transition: theme.transitions.create("background-color"),
                    }}
                  />
                ))}
              </Stack>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    px: 3,
                    background: theme.palette.primary.main,
                    "&:hover": {
                      background: theme.palette.primary.dark,
                    },
                  }}
                >
                  Next
                </Button>
              </motion.div>
            </Stack>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            style={{ width: "100%" }}
          >
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Your Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.23)"
                          : "rgba(0, 0, 0, 0.23)",
                    },
                    "&:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{
                    py: 1.5,
                    background: theme.palette.primary.main,
                    "&:hover": {
                      background: theme.palette.primary.dark,
                    },
                  }}
                >
                  {isSubmitting ? "Getting Started..." : "Get Started"}
                </Button>
              </motion.div>
            </Stack>
          </motion.form>
        )}
      </Paper>
    </motion.div>
  );
}
