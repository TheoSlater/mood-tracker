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
      onEmotionsChange(newSelection); // Update parent state
      return newSelection; // Update local state
    });
  };

  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        How are you feeling today?
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select all emotions that apply
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
        {emotions.map((emotion) => (
          <Chip
            key={emotion}
            label={emotion}
            onClick={() => handleToggle(emotion)}
            color={selectedEmotions.includes(emotion) ? 'primary' : 'default'}
            variant={selectedEmotions.includes(emotion) ? 'filled' : 'outlined'}
            sx={{ m: 0.5 }}
          />
        ))}
      </Box>
    </Box>
  );
}
