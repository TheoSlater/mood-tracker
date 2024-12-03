import React, { useState, memo } from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { moodSettings } from "../utils/moodSettings";

interface DateControlsProps {
  selectedDate: string;
  moodHistory: { [date: string]: { mood: number; emotions: string[] } };
  onDateChange: (newDate: string) => void;
  getDateForDay: (day: number) => string;
  getCurrentDate: () => string;
}

const DateControls: React.FC<DateControlsProps> = ({
  selectedDate,
  moodHistory,
  onDateChange,
  getDateForDay,
  getCurrentDate,
}) => {
  const [draggingDate, setDraggingDate] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)"); // Detect mobile screens

  const getDayName = (date: string) => {
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    return days[new Date(date).getDay()];
  };

  const getDayNumber = (date: string) => new Date(date).getDate();

  const generateWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = getDateForDay(i);
      const isSelected = date === selectedDate;
      const mood = moodHistory[date]?.mood;
      const isToday = date === getCurrentDate();
      days.push({
        date,
        dayName: getDayName(date),
        dayNumber: getDayNumber(date),
        isSelected,
        mood,
        isToday,
      });
    }
    return days;
  };

  const getMoodColor = (mood: number | undefined) =>
    mood !== undefined ? moodSettings[mood].color : "#b0b0b0";

  const handleButtonClick = (date: string) => {
    if (date !== selectedDate) {
      onDateChange(date);
      setDraggingDate(date);
    }
  };

  const buttonStyle = {
    minWidth: 0,
    height: { xs: 50, sm: 60 },
    p: 1,
    borderRadius: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.3s ease-out, background-color 0.3s ease-out",
  };

  interface Day {
    date: string;
    dayName: string;
    dayNumber: number;
    isSelected: boolean;
    mood?: number;
    isToday: boolean;
  }

  const generateButton = (day: Day) => (
    <Button
      key={day.date}
      onClick={() => handleButtonClick(day.date)}
      variant={day.isSelected ? "contained" : "text"}
      sx={{
        ...buttonStyle,
        flex: isMobile ? "1 0 20%" : "1 0 12%", // Flex value adjusted for mobile
        color: day.isSelected ? "#fff" : theme.palette.text.secondary,
        border: day.isToday
          ? `2px solid ${theme.palette.primary.main}`
          : "none",
        "&:hover": {
          backgroundColor: day.isSelected
            ? theme.palette.primary.dark
            : theme.palette.action.hover,
        },
        transform: draggingDate === day.date ? "scale(1.1)" : "scale(1)",
        boxShadow:
          draggingDate === day.date
            ? "0px 4px 15px rgba(0, 0, 0, 0.2)"
            : "none",
        position: "relative",
        zIndex: draggingDate === day.date ? 1 : "auto",
        outline: "none",
        "&:focus-visible": {
          outline: `2px solid ${theme.palette.primary.main}`,
        },
      }}
      aria-label={`Select ${day.dayName} ${day.dayNumber}`}
    >
      <Typography
        variant="body2"
        sx={{
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
          fontWeight: day.isSelected ? "bold" : "normal",
        }}
      >
        {day.dayName}
      </Typography>
      <Box
        sx={{
          mt: 0.5,
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: getMoodColor(day.mood),
        }}
      />
    </Button>
  );

  return (
    <Box
      sx={{
        mb: "15px",
        background: theme.palette.background.paper,
        borderRadius: 2,
        p: 2,
        width: "100%",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 0.5,
          justifyContent: "space-between",
          flexWrap: "wrap", // Allow wrapping of items for smaller screens
          width: "100%",
        }}
      >
        {generateWeekDays().map(generateButton)}
      </Box>
    </Box>
  );
};

export default memo(DateControls);
