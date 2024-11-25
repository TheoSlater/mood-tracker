import { motion } from "framer-motion";
import { Box } from "@mui/material";
import { moodSettings } from "../utils/moodSettings";

interface MoodCircleProps {
  mood: number;
  darkMode: boolean;
}

const MoodCircle: React.FC<MoodCircleProps> = ({ mood, darkMode }) => {
  return (
    <Box sx={{ position: 'relative', my: 4 }}>
      <motion.div
        style={{
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, ${moodSettings[mood].color}, rgba(0,0,0,0.1))`,
          boxShadow: darkMode 
            ? `0 0 30px ${moodSettings[mood].color}80, 
               0 0 60px ${moodSettings[mood].color}40, 
               0 0 90px ${moodSettings[mood].color}20`
            : `0 0 30px ${moodSettings[mood].color}40`,
        }}
        animate={{
          scale: [1, 1.02, 1],
          rotate: [0, 360], // Adds rotation
          width: moodSettings[mood].size,
          height: moodSettings[mood].size,
        }}
        transition={{
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: 10, // Duration for one full rotation
            repeat: Infinity,
            ease: "linear", // Smooth continuous rotation
          },
          width: {
            type: "spring",
            stiffness: 100,
            damping: 15,
          },
          height: {
            type: "spring",
            stiffness: 100,
            damping: 15,
          },
        }}
      />
    </Box>
  );
};

export default MoodCircle;
