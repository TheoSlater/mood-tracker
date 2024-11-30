import React, { useState, memo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { moodSettings } from '../utils/moodSettings';

interface DateControlsProps {
  selectedDate: string;
  moodHistory: { [date: string]: { mood: number; emotions: string[] } }; // Update the type here
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

  const getDayName = (date: string) => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return days[new Date(date).getDay()];
  };

  const getDayNumber = (date: string) => {
    return new Date(date).getDate();
  };

  const generateWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = getDateForDay(i);
      const isSelected = date === selectedDate;
      const mood = moodHistory[date]?.mood; // Access mood property
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
  

  const getMoodColor = (mood: number | undefined) => {
    if (mood === undefined) return '#3A3A3A';
    return moodSettings[mood].color;
  };

  const handleButtonClick = (date: string) => {
    if (date === selectedDate) return;
    onDateChange(date); // Update the selected date immediately
    setDraggingDate(date); // Set the dragging date to trigger animation
  };

  return (
    <Box
      sx={{
        mb: "15px",
        background: (theme) => theme.palette.background.paper,
        borderRadius: 2,
        p: 2,
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 0.5,
          justifyContent: "space-between",
          width: '100%',
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
              color: (theme) =>
                day.isSelected 
                  ? '#fff'
                  : theme.palette.text.secondary,
              border: day.isToday ? '2px solid #3A3A3A' : 'none',
              '&:hover': {
                backgroundColor: (theme) => 
                  day.isSelected 
                    ? theme.palette.primary.dark 
                    : theme.palette.action.hover,
              },
              transition: 'transform 0.3s ease-out, background-color 0.3s ease-out',
              transform: draggingDate === day.date ? 'scale(1.1)' : 'scale(1)',
              boxShadow: draggingDate === day.date ? '0px 4px 15px rgba(0, 0, 0, 0.3)' : 'none',
              backgroundColor: draggingDate === day.date
                ? (theme) => theme.palette.primary.main
                : 'transparent',
              position: 'relative',
              zIndex: draggingDate === day.date ? 1 : 'auto',
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                fontWeight: day.isSelected ? 'bold' : 'normal',
              }}
            >
              {day.dayName}
            </Typography>
            <Box
              sx={{
                mt: 0.5,
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: getMoodColor(day.mood),
                transition: 'background-color 0.3s ease-out',
              }}
            />
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default memo(DateControls); 
