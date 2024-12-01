import { Box, Card, CardContent, Typography } from '@mui/material';
import { useMood } from '../hooks/useMood';

interface NotesSectionProps {
  selectedDate: string;
}

export default function NotesSection({ selectedDate }: NotesSectionProps) {
  const { moodHistory } = useMood(selectedDate);

  const renderMoodHistory = () =>
    Object.entries(moodHistory).map(([date, data]) => (
      <Card
        key={date}
        sx={{
          mb: 2,
          borderRadius: 2,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {new Date(date).toLocaleDateString()}
          </Typography>
          <Typography variant="body1">
            <strong>Mood:</strong> {data.mood}
          </Typography>
          <Typography variant="body1">
            <strong>Emotions:</strong> {data.emotions.join(', ') || 'None'}
          </Typography>
          <Typography variant="body1">
            <strong>Journal:</strong> {data.journal || 'No notes'}
          </Typography>
        </CardContent>
      </Card>
    ));

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Saved Notes & Moods
      </Typography>
      {Object.keys(moodHistory).length > 0 ? (
        renderMoodHistory()
      ) : (
        <Typography variant="body2" color="text.secondary">
          No records found.
        </Typography>
      )}
    </Box>
  );
}
