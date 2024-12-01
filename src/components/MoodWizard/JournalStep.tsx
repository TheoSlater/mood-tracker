import { TextField, Box, Typography } from '@mui/material';

interface JournalStepProps {
  journal: string;
  onJournalChange: (value: string) => void;
}

export default function JournalStep({ journal, onJournalChange }: JournalStepProps) {
  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 1,
          fontSize: '1.3rem',
          fontWeight: 600
        }}
      >
        Want to write about your day?
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          mb: 3,
          fontSize: '0.95rem'
        }}
      >
        Optional: Add some notes about what made you feel this way
      </Typography>
      <TextField
        multiline
        rows={4}
        fullWidth
        placeholder="Today I felt..."
        value={journal}
        onChange={(e) => onJournalChange(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: (theme) => 
              theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.02)',
          }
        }}
      />
    </Box>
  );
}