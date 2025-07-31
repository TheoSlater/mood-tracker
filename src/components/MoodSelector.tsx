import { useState, useEffect, memo } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  CircularProgress,
  Fade,
  SwipeableDrawer,
  styled,
  Button,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { AnimatedBlob } from "./blob";

const MoodOption = styled(Box)<{ selected?: boolean }>(
  ({ theme, selected }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: selected ? theme.palette.action.selected : "transparent",
    border: `2px solid ${
      selected ? theme.palette.primary.main : "transparent"
    }`,
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      transform: "translateY(-4px)",
    },
  })
);

const MoodLabel = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  fontWeight: 500,
  textAlign: "center",
  fontSize: "0.9rem",
}));

const DragHandle = styled(Box)(({ theme }) => ({
  width: 40,
  height: 4,
  borderRadius: 3,
  backgroundColor: theme.palette.text.disabled,
  margin: "8px auto",
  cursor: "grab",
}));

interface MoodSelectorProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  onSelectMood: (moodIndex: number) => void;
  moodSettings: Array<{
    label: string;
    size: number;
    colors: string[];
    gradientAngle: number;
  }>;
  currentMoodIndex?: number;
  saving?: boolean;
}

const MemoizedBlob = memo(
  ({
    size,
    colors,
    gradientAngle,
    animate,
  }: {
    size: number;
    colors: string[];
    gradientAngle: number;
    animate: boolean;
  }) => (
    <AnimatedBlob
      size={size}
      colors={colors}
      gradientAngle={gradientAngle}
      intensity={0.2}
      animateGradient={animate}
      glowIntensity={4}
    />
  ),
  (prev, next) =>
    prev.size === next.size &&
    prev.animate === next.animate &&
    prev.gradientAngle === next.gradientAngle &&
    prev.colors.join() === next.colors.join()
);

export default function MoodSelector({
  open,
  onClose,
  onOpen,
  onSelectMood,
  moodSettings,
  saving = false,
}: MoodSelectorProps) {
  const [mounted, setMounted] = useState(false);

  // Stepper state: 0 = select, 1 = confirm
  const [step, setStep] = useState(0);

  // Selected mood index (local state until confirmed)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset when drawer closes
  useEffect(() => {
    if (!open) {
      setStep(0);
      setSelectedIndex(null);
    }
  }, [open]);

  const handleMoodClick = (index: number) => {
    if (saving) return;
    setSelectedIndex(index);
    setStep(1); // move to confirm step
  };

  const handleBack = () => {
    setStep(0);
    setSelectedIndex(null);
  };

  const handleConfirm = () => {
    if (selectedIndex !== null && !saving) {
      onSelectMood(selectedIndex);
      // You can close the drawer here or stay open if you want
      onClose();
      setStep(0);
      setSelectedIndex(null);
    }
  };

  if (typeof window === "undefined" || !mounted) return null;

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={() => {
        onClose();
        setStep(0);
        setSelectedIndex(null);
      }}
      onOpen={onOpen}
      disableSwipeToOpen={false}
      swipeAreaWidth={24}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          height: 800,
          overflow: "hidden",
          px: 2,
          pb: 4,
          display: "flex",
          flexDirection: "column",
        },
      }}
      ModalProps={{ keepMounted: true }}
    >
      <DragHandle />
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">How are you feeling?</Typography>
        <IconButton onClick={onClose} disabled={saving}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Stepper activeStep={step} alternativeLabel>
        <Step>
          <StepLabel>Select</StepLabel>
        </Step>
        <Step>
          <StepLabel>Confirm</StepLabel>
        </Step>
      </Stepper>

      <Box sx={{ flexGrow: 1, overflowY: "auto", mt: 2 }}>
        {step === 0 && (
          <Grid container spacing={2} justifyContent="center">
            {moodSettings.map((mood, index) => (
              <Grid item xs={6} sm={4} key={index}>
                <MoodOption
                  selected={selectedIndex === index}
                  onClick={() => handleMoodClick(index)}
                  sx={{
                    opacity: saving ? 0.6 : 1,
                    pointerEvents: saving ? "none" : "auto",
                    userSelect: "none",
                  }}
                >
                  <MemoizedBlob
                    size={mood.size * 0.6}
                    colors={mood.colors}
                    gradientAngle={mood.gradientAngle}
                    animate={false} // no animation at selection step
                  />
                  <MoodLabel>{mood.label}</MoodLabel>
                </MoodOption>
              </Grid>
            ))}
          </Grid>
        )}

        {step === 1 && selectedIndex !== null && (
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <MemoizedBlob
              size={moodSettings[selectedIndex].size}
              colors={moodSettings[selectedIndex].colors}
              gradientAngle={moodSettings[selectedIndex].gradientAngle}
              animate={true} // animate on confirm step
            />
            <Typography variant="h6" sx={{ mt: 2 }}>
              {moodSettings[selectedIndex].label}
            </Typography>

            <Box
              sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}
            >
              <Button variant="outlined" onClick={handleBack} disabled={saving}>
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirm}
                disabled={saving}
              >
                Confirm
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {saving && (
        <Fade in={saving}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 4,
              gap: 1,
            }}
          >
            <CircularProgress size={16} />
            <Typography variant="body2" color="text.secondary">
              Saving your mood...
            </Typography>
          </Box>
        </Fade>
      )}

      {step === 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, textAlign: "center" }}
        >
          Select a mood to record how you're feeling today
        </Typography>
      )}
    </SwipeableDrawer>
  );
}
