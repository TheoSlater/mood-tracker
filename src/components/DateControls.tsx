import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { moodSettings } from "../utils/moodSettings";
import { load } from "@tauri-apps/plugin-store";

type DateControlsProps = {
  handleDateChange: (direction: "previous" | "today" | "next") => void;
  mood: number;
  onDaySelect: (index: number) => void;
  moodHistory: { [key: string]: number };
  setMoodHistory: React.Dispatch<
    React.SetStateAction<{ [key: string]: number }>
  >;
  selectedDate: string;
};

const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];

const DateControls: React.FC<DateControlsProps> = ({
  mood,
  onDaySelect,
  moodHistory,
  setMoodHistory,
}) => {
  const todayIndex = (new Date().getDay() + 6) % 7; 
  const [selectedDay, setSelectedDay] = useState(todayIndex);

  const today = new Date();
  const todayDate = today.getDate(); 

  const handleMoodChange = async (value: number) => {
    const dayOfMonth = today.getDate() - (todayIndex - selectedDay);
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
      onDaySelect(index);
      const newMoodValue = mood;
      handleMoodChange(newMoodValue);
    }
  };



  return (
  <Box
    sx={{
      mb: "15px",
      background: (theme) => theme.palette.background.paper, 
      borderRadius: 2,
      p: 2,
    }}
  >

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center", flex: 1 }}>
        {daysOfWeek.map((day, index) => (
          <Box
          key={index}
          onClick={() => handleDayClick(index)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "12%", sm: "14%", md: "18%" },
              height: { xs: 50, sm: 60 },
              borderRadius: 2,
              background: (theme) =>
                selectedDay === index ? theme.palette.action.hover : "transparent",
              color: (theme) =>
                selectedDay === index ? theme.palette.text.primary : theme.palette.text.secondary,
              cursor: "pointer",
              "&:hover": {
                background: (theme) => theme.palette.action.hover,
              },
              transition: "background-color 0.3s ease",
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
                    : "#3A3A3A",
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default DateControls;
