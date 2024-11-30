import { Box, Chip, Typography } from '@mui/material';

interface EmotionDisplayProps {
  emotions: string[];
}

export default function EmotionDisplay({ emotions }: EmotionDisplayProps) {
  if (emotions.length === 0) return null;

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom sx={{ textAlign: 'center' }}>
        Emotions
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
        {emotions.map((emotion) => (
          <Chip
            key={emotion}
            label={emotion}
            color="primary"
            variant="outlined"
            size="small"
          />
        ))}
      </Box>
    </Box>
  );
}