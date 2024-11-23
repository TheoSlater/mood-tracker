import { motion } from "framer-motion";
import { moodSettings } from "../utils/moodSettings";

interface MoodCircleProps {
  mood: number;
  darkMode: boolean;
}

const MoodCircle: React.FC<MoodCircleProps> = ({ mood, darkMode }) => {
  return (
    <motion.div
      style={{
        borderRadius: "50%",
        marginTop: "30px",
        boxShadow: darkMode ? `0 0 20px ${moodSettings[mood].color}` : "none",
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
  );
};

export default MoodCircle;
