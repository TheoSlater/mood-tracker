import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Box, Typography, Paper } from "@mui/material";

interface OnboardingStepProps {
  icon: ReactNode;
  title: string;
  description: string;
  isActive: boolean;
  iconBg: string;
  iconColor: string;
}

export function OnboardingStep({
  icon,
  title,
  description,
  isActive,
}: OnboardingStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 50 }}
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
              background: (theme) => theme.palette.background.paper,
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              color: (theme) => theme.palette.primary.main,
              boxShadow: (theme) =>
                `0 8px 32px ${
                  theme.palette.mode === "dark"
                    ? "rgba(0, 0, 0, 0.3)"
                    : "rgba(0, 0, 0, 0.1)"
                }`,
            }}
          >
            {icon}
          </Paper>
        </motion.div>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ maxWidth: "sm" }}
        >
          {description}
        </Typography>
      </Box>
    </motion.div>
  );
}
