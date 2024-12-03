import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import React, { useLayoutEffect, useState } from "react";
import { Box, Button, Paper, Typography, styled } from "@mui/material";

interface TourStepProps {
  target: string;
  content: string;
  isVisible: boolean;
  onNext: () => void;
  onSkip: () => void;
  position?: "top" | "bottom" | "left" | "right";
}

const Arrow = styled("div")(({ theme }) => ({
  position: "absolute",
  width: 16,
  height: 16,
  backgroundColor: theme.palette.background.paper,
  transform: "rotate(45deg)",
}));

export const TourStep: React.FC<TourStepProps> = ({
  target,
  content,
  isVisible,
  onNext,
  onSkip,
  position = "bottom",
}) => {
  const [coords, setCoords] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [isPositioned, setIsPositioned] = useState(false);

  useLayoutEffect(() => {
    const updatePosition = () => {
      const element = document.querySelector(target);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setCoords({
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
          });
          setIsPositioned(true);
        }
      }
    };

    // Use requestAnimationFrame for more reliable positioning
    const rafId = requestAnimationFrame(updatePosition);

    // Retry positioning after a short delay
    const timer = setTimeout(updatePosition, 300);

    window.addEventListener("resize", updatePosition);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
      window.removeEventListener("resize", updatePosition);
    };
  }, [target, isVisible]);

  const getPopoverPosition = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    let positionStyles = {
      top: coords.y + coords.height + 20,
      left: coords.x + coords.width / 2 - 150,
    };

    switch (position) {
      case "top":
        positionStyles = {
          top: coords.y - 120,
          left: coords.x + coords.width / 2 - 150,
        };
        break;
      case "bottom":
        positionStyles = {
          top: coords.y + coords.height + 20,
          left: coords.x + coords.width / 2 - 150,
        };
        break;
      case "left":
        positionStyles = {
          top: coords.y + coords.height / 2 - 50,
          left: coords.x - 320,
        };
        break;
      case "right":
        positionStyles = {
          top: coords.y + coords.height / 2 - 50,
          left: coords.x + coords.width + 20,
        };
        break;
    }

    // Check for overflow and adjust positions if necessary
    if (positionStyles.left + 300 > windowWidth) {
      positionStyles.left = windowWidth - 320; // Adjust for right overflow
    }
    if (positionStyles.left < 0) {
      positionStyles.left = 20; // Adjust for left overflow
    }

    if (positionStyles.top + 120 > windowHeight) {
      positionStyles.top = windowHeight - 140; // Adjust for bottom overflow
    }
    if (positionStyles.top < 0) {
      positionStyles.top = 20; // Adjust for top overflow
    }

    return positionStyles;
  };

  const getArrowPosition = () => {
    switch (position) {
      case "top":
        return {
          bottom: -8,
          left: "50%",
          transform: "translateX(-50%) rotate(180deg)",
        };
      case "bottom":
        return {
          top: -8,
          left: "50%",
          transform: "translateX(-50%)",
        };
      case "left":
        return {
          right: -8,
          top: "50%",
          transform: "translateY(-50%) rotate(90deg)",
        };
      case "right":
        return {
          left: -8,
          top: "50%",
          transform: "translateY(-50%) rotate(-90deg)",
        };
    }
  };

  // Only render if positioned correctly and visible
  if (!isPositioned || !isVisible) return null;

  return (
    <AnimatePresence>
      <>
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1300,
          }}
          onClick={onSkip}
        />
        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          sx={{
            position: "fixed",
            zIndex: 1301,
            width: 300,
            ...getPopoverPosition(),
          }}
        >
          <Paper elevation={4} sx={{ position: "relative", p: 2 }}>
            <Arrow sx={getArrowPosition()} />
            <Typography sx={{ mb: 2 }}>{content}</Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button color="inherit" onClick={onSkip} size="small">
                Skip tour
              </Button>
              <Button
                variant="contained"
                onClick={onNext}
                size="small"
                endIcon={<ArrowUpRight size={16} />}
              >
                Next
              </Button>
            </Box>
          </Paper>
        </Box>
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          sx={{
            position: "fixed",
            zIndex: 1300,
            pointerEvents: "none",
            top: coords.y,
            left: coords.x,
            width: coords.width,
            height: coords.height,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: 1,
              border: "2px solid",
              borderColor: "primary.main",
              boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
            }}
          />
        </Box>
      </>
    </AnimatePresence>
  );
};
