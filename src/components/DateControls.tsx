import React, { useState } from "react";
import { Box, Container, IconButton, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { moodSettings } from "../utils/moodSettings";
import { load } from "@tauri-apps/plugin-store";

type DateControlsProps = {
  handleDateChange: (direction: "previous" | "today" | "next") => void;
  mood: number; // Current mood to control the dot color
  onDaySelect: (index: number) => void; // New prop to handle day selection
  moodHistory: { [key: string]: number }; // To track the mood history for each day
  setMoodHistory: React.Dispatch<
    React.SetStateAction<{ [key: string]: number }>
  >; // Set mood history state
  selectedDate: string; // The selected date to use for mood storage
};

const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];

const DateControls: React.FC<DateControlsProps> = ({
  handleDateChange,
  mood,
  onDaySelect,
  moodHistory,
  setMoodHistory,
}) => {
  const todayIndex = (new Date().getDay() + 6) % 7; // Shift Sunday (0) to last
  const [selectedDay, setSelectedDay] = useState(todayIndex);

  const today = new Date();
  const todayDate = today.getDate(); // Get today's date number (1-31)

  const handleMoodChange = async (value: number) => {
    // Get the selected day in the current month
    const dayOfMonth = today.getDate() - (todayIndex - selectedDay);

    // Update mood for the selected day and store it
    const newMoodHistory = { ...moodHistory, [dayOfMonth]: value };
    setMoodHistory(newMoodHistory);

    try {
      const store = await load("store.json", { autoSave: false });
      await store.set("moodHistory", newMoodHistory);
    } catch (e) {
      console.error("Error saving mood:", e);
    }
  };

  const handleDayClick = (index: number) => {
    const dayOfMonth = today.getDate() - (todayIndex - index);
    if (dayOfMonth <= todayDate) {
      setSelectedDay(index);
      onDaySelect(index); // Pass day selection back to parent component

      // Call handleMoodChange to update the mood for the selected day
      const newMoodValue = mood; // Set this value based on user selection or some default
      handleMoodChange(newMoodValue);
    }
  };

  // Disable "next" button if we're already on today or in the past.
  const isNextDisabled = selectedDay >= todayIndex;

  // Enable navigation to previous days, but disable "next" button when on today.
  const handleLeftClick = () => {
    const newSelectedDay = selectedDay - 1;
    if (newSelectedDay >= 0) {
      setSelectedDay(newSelectedDay);
      handleDateChange("previous");
    }
  };

  const handleRightClick = () => {
    if (selectedDay < todayIndex) {
      setSelectedDay(selectedDay + 1);
      handleDateChange("next");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        background: "#2D2D2D",
        borderRadius: 2,
        p: 2,
      }}
    >
      <IconButton
        onClick={handleLeftClick}
        sx={{ color: "#FFFFFF", "&:hover": { background: "#3A3A3A" } }}
      >
        <ChevronLeftIcon />
      </IconButton>

      <Box sx={{ display: "flex", gap: 1 }}>
        {daysOfWeek.map((day, index) => (
          <Box
            key={index}
            onClick={() => handleDayClick(index)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 60,
              borderRadius: 2,
              background: selectedDay === index ? "#404040" : "transparent",
              color: selectedDay === index ? "#FFFFFF" : "#9E9E9E",
              cursor: "pointer",
              "&:hover": { background: "#505050" },
            }}
          >
            <Typography variant="body2">{day}</Typography>
            <Box
              sx={{
                mt: 1,
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor:
                  selectedDay === index
                    ? moodSettings[mood].color
                    : moodHistory[today.getDate() - (todayIndex - index)] !==
                      undefined
                    ? moodSettings[
                        moodHistory[today.getDate() - (todayIndex - index)]
                      ].color
                    : "#3A3A3A", // Default if no mood is set
              }}
            />
          </Box>
        ))}
      </Box>

      <IconButton
        onClick={handleRightClick}
        disabled={isNextDisabled}
        sx={{
          color: "#FFFFFF",
          "&:hover": { background: "#3A3A3A" },
          opacity: isNextDisabled ? 0.5 : 1,
        }}
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
};

export default DateControls;
