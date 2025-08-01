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
  Paper,
  Zoom,
  Slide,
} from "@mui/material";
import {
  Close as CloseIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import { AnimatedBlob } from "./blob";

const MoodOption = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "selected",
})<{ selected?: boolean }>(({ theme, selected }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(3),
  borderRadius: theme.spacing(3),
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  backgroundColor: selected
    ? theme.palette.primary.light + "20"
    : theme.palette.background.paper,
  border: `3px solid ${selected ? theme.palette.primary.main : "transparent"}`,
  position: "relative",
  "&:hover": {
    transform: selected ? "scale(1.02)" : "scale(1.01)",
    backgroundColor: selected
      ? theme.palette.primary.light + "20"
      : theme.palette.action.hover,
    boxShadow: theme.shadows[8],
  },
  "&:active": {
    transform: "scale(0.98)",
  },
  boxShadow: selected ? theme.shadows[12] : theme.shadows[2],
}));

const MoodLabel = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  fontWeight: 600,
  textAlign: "center",
  fontSize: "0.95rem",
  color: theme.palette.text.primary,
}));

const DragHandle = styled(Box)(({ theme }) => ({
  width: 48,
  height: 4,
  borderRadius: 4,
  backgroundColor: theme.palette.divider,
  margin: "12px auto 24px auto",
  cursor: "grab",
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.text.secondary,
  },
}));

const CheckMarkIcon = styled(CheckIcon)(({ theme }) => ({
  position: "absolute",
  top: 12,
  right: 12,
  color: theme.palette.primary.main,
  fontSize: "1.5rem",
}));

const ConfirmationContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(6, 3),
  textAlign: "center",
}));

const ActionButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  width: "100%",
  maxWidth: 320,
  marginTop: theme.spacing(4),
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
      glowIntensity={animate ? 6 : 3}
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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset when drawer closes
  useEffect(() => {
    if (!open) {
      setShowConfirmation(false);
      setSelectedIndex(null);
    }
  }, [open]);

  const handleMoodClick = (index: number) => {
    if (saving) return;
    setSelectedIndex(index);
    setShowConfirmation(true);
  };

  const handleBack = () => {
    setShowConfirmation(false);
    setSelectedIndex(null);
  };

  const handleConfirm = () => {
    if (selectedIndex !== null && !saving) {
      onSelectMood(selectedIndex);
      onClose();
      setShowConfirmation(false);
      setSelectedIndex(null);
    }
  };

  const handleDrawerClose = () => {
    onClose();
    setShowConfirmation(false);
    setSelectedIndex(null);
  };

  if (typeof window === "undefined" || !mounted) return null;

  const selectedMood =
    selectedIndex !== null ? moodSettings[selectedIndex] : null;

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={handleDrawerClose}
      onOpen={onOpen}
      disableSwipeToOpen={false}
      swipeAreaWidth={24}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          maxHeight: "85vh",
          overflow: "hidden",
          px: 3,
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
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "text.primary",
          }}
        >
          {showConfirmation ? "Confirm your mood" : "How are you feeling?"}
        </Typography>
        <IconButton
          onClick={handleDrawerClose}
          disabled={saving}
          sx={{
            color: "text.secondary",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        {!showConfirmation ? (
          <Fade in={!showConfirmation} timeout={300}>
            <Grid container spacing={2} justifyContent="center">
              {moodSettings.map((mood, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Zoom
                    in={!showConfirmation}
                    timeout={300}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <MoodOption
                      selected={selectedIndex === index}
                      onClick={() => handleMoodClick(index)}
                      sx={{
                        opacity: saving ? 0.6 : 1,
                        pointerEvents: saving ? "none" : "auto",
                        userSelect: "none",
                      }}
                      elevation={selectedIndex === index ? 8 : 2}
                    >
                      {selectedIndex === index && (
                        <Zoom in={selectedIndex === index} timeout={200}>
                          <CheckMarkIcon />
                        </Zoom>
                      )}
                      <MemoizedBlob
                        size={mood.size * 0.75}
                        colors={mood.colors}
                        gradientAngle={mood.gradientAngle}
                        animate={selectedIndex === index}
                      />
                      <MoodLabel>{mood.label}</MoodLabel>
                    </MoodOption>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Fade>
        ) : (
          <Slide
            direction="left"
            in={showConfirmation}
            timeout={400}
            mountOnEnter
            unmountOnExit
          >
            <ConfirmationContainer>
              <Box sx={{ mb: 4 }}>
                <MemoizedBlob
                  size={selectedMood!.size * 1.3}
                  colors={selectedMood!.colors}
                  gradientAngle={selectedMood!.gradientAngle}
                  animate={true}
                />
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: "text.primary",
                }}
              >
                {selectedMood!.label}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  mb: 4,
                  fontSize: "1.1rem",
                }}
              >
                You're feeling {selectedMood!.label.toLowerCase()} today
              </Typography>

              <ActionButtonContainer>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={saving}
                  size="large"
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600,
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleConfirm}
                  disabled={saving}
                  size="large"
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600,
                    boxShadow: 4,
                    "&:hover": {
                      boxShadow: 8,
                    },
                  }}
                >
                  {saving ? "Saving..." : "Confirm"}
                </Button>
              </ActionButtonContainer>
            </ConfirmationContainer>
          </Slide>
        )}
      </Box>

      <Fade in={saving} timeout={300}>
        <Box
          sx={{
            display: saving ? "flex" : "none",
            justifyContent: "center",
            alignItems: "center",
            py: 2,
            px: 3,
            gap: 1.5,
            backgroundColor: "action.hover",
            borderRadius: 2,
            mx: -3,
            mt: 2,
          }}
        >
          <CircularProgress size={20} thickness={4} />
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
            }}
          >
            Saving your mood...
          </Typography>
        </Box>
      </Fade>

      {!showConfirmation && (
        <Fade in={!showConfirmation} timeout={300}>
          <Typography
            variant="body2"
            sx={{
              mt: 3,
              textAlign: "center",
              color: "text.secondary",
              fontSize: "0.9rem",
              lineHeight: 1.5,
            }}
          >
            Tap a mood to record how you're feeling today
          </Typography>
        </Fade>
      )}
    </SwipeableDrawer>
  );
}
