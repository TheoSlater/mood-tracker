import React, { memo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { moodSettings } from '../utils/moodSettings';

interface DateControlsProps {
  selectedDate: string;
  moodHistory: { [date: string]: number };
  onDateChange: (newDate: string) => void;
  getDateForDay: (index: number) => string;
  getCurrentDate: () => string;
}

const DateControls: React.FC<DateControlsProps> = ({
  selectedDate,
  moodHistory,
  onDateChange,
  getDateForDay,
  getCurrentDate,
}) => {
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
      const mood = moodHistory[date];
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
            onClick={() => {
              if (day.date === selectedDate) return;
              onDateChange(day.date); // Pass the exact date clicked
            }}
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
              border: day.isToday ? '2px solid #3A3A3A' : 'none', // Dark grey outline for today
              '&:hover': {
                backgroundColor: (theme) => 
                  day.isSelected 
                    ? theme.palette.primary.dark 
                    : theme.palette.action.hover,
              },
            }}
            aria-label={`Select mood for ${day.dayName}, ${day.dayNumber}`}
            aria-selected={day.isSelected}
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
              }}
            />
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default memo(DateControls); // FIXED: Preventing unnecessary re-renders
