import { Box, Chip, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

const emotions = [
  'Happy', 'Excited', 'Peaceful',
  'Anxious', 'Sad', 'Angry',
  'Grateful', 'Tired', 'Energetic',
  'Stressed', 'Relaxed', 'Frustrated'
];

interface EmotionSelectorProps {
  onEmotionsChange: (emotions: string[]) => void;
  initialEmotions?: string[];
}

export default function EmotionSelector({ 
  onEmotionsChange, 
  initialEmotions = [] 
}: EmotionSelectorProps) {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(initialEmotions);

  useEffect(() => {
    setSelectedEmotions(initialEmotions);
  }, [initialEmotions]);

  const handleToggle = (emotion: string) => {
    setSelectedEmotions((prev: string[]) => {
      const newSelection = prev.includes(emotion)
        ? prev.filter((e) => e !== emotion)
        : [...prev, emotion];
      onEmotionsChange(newSelection);
      return newSelection;
    });
  };

  return (
    <Box sx={{ 
      width: '100%', 
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 1,
            fontSize: '1.3rem',
            fontWeight: 600
          }}
        >
          How are you feeling today?
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            fontSize: '0.95rem'
          }}
        >
          Select all emotions that apply
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: 1,
        width: '100%',
        maxWidth: 500,
        mx: 'auto',
        flex: 1,
        alignContent: 'flex-start',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {emotions.map((emotion) => (
          <Box 
            key={emotion}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 0.5
            }}
          >
            <Chip
              label={emotion}
              onClick={() => handleToggle(emotion)}
              color={selectedEmotions.includes(emotion) ? 'primary' : 'default'}
              variant={selectedEmotions.includes(emotion) ? 'filled' : 'outlined'}
              sx={{
                width: '100%',
                borderRadius: '16px',
                fontSize: '0.9rem',
                height: 32,
                transition: 'all 0.15s ease-in-out',
                transform: selectedEmotions.includes(emotion) ? 'scale(1.05)' : 'scale(1)',
                '&:hover': {
                  transform: selectedEmotions.includes(emotion) ? 'scale(1.05)' : 'scale(1.02)',
                },
                '&.MuiChip-filled': {
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}