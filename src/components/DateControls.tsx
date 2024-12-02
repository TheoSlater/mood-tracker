import React, { useState, memo } from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
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
  const theme = useTheme(); // Add this line to access the theme

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

  return (
    <Box
      sx={{
        mb: "15px",
        background: (theme) => theme.palette.background.paper, // Now using theme here
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
          width: "100%",
        }}
      >
        {generateWeekDays().map((day) => (
          <Button
            key={day.date}
            onClick={() => handleButtonClick(day.date)}
            variant={day.isSelected ? "contained" : "text"}
            sx={{
              minWidth: 0,
              flex: 1,
              height: { xs: 50, sm: 60 },
              p: 1,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: day.isSelected ? "#fff" : theme.palette.text.secondary, // Using theme here as well
              border: day.isToday
                ? `2px solid ${theme.palette.primary.main}`
                : "none",
              "&:hover": {
                backgroundColor: day.isSelected
                  ? theme.palette.primary.dark
                  : theme.palette.action.hover,
              },
              transition:
                "transform 0.3s ease-out, background-color 0.3s ease-out",
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
                transition: "background-color 0.3s ease-out",
              }}
            />
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default memo(DateControls);
