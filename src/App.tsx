import { useEffect, useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Container, Stack, Typography } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import DateControls from './components/DateControls';
import MoodCircle from './components/MoodCircle';
import SettingsButton from './components/Settings/SettingsButton';
import SettingsDialog from './components/Settings/SettingsDialog';
import AddMoodButton from './components/MoodWizard/AddMoodButton';
import MoodWizard from './components/MoodWizard/MoodWizard';
import MoodMenu from './components/MoodMenu';
import { useMood } from './hooks/useMood';
import { useTheme } from './hooks/useTheme';
import { useDate } from './hooks/useDate';

function App() {
  const { selectedDate, handleDateChange, getDateForDay, getCurrentDate } = useDate();
  const { mood, gradient, moodHistory, handleMoodChange, deleteData, isMoodLoaded } = useMood(selectedDate);
  const { darkMode, toggleTheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [emotions, setEmotions] = useState<string[]>([]);

  useEffect(() => {
    // This ensures loadSavedMood is called automatically when selectedDate changes
  }, [selectedDate]);

  if (!isMoodLoaded) {
    return <div>Loading...</div>;
  }

  const handleWizardComplete = (data: { mood: number; emotions: string[] }) => {
    handleMoodChange(data.mood);
    setEmotions(data.emotions);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setWizardOpen(true);
  };

  const moodDescription = mood === null
    ? 'Unknown'
    : mood < 2
    ? 'Unpleasant'
    : mood > 2
    ? 'Pleasant'
    : 'Neutral';

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100vw',
          height: '100vh',
          background: `linear-gradient(45deg, ${gradient})`,
          transition: 'background 3s ease-out',
        }}
      >
        <SettingsButton onClick={() => setSettingsOpen(true)} />
        <SettingsDialog
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          darkMode={darkMode ?? false} // Fallback to false if darkMode is null
          onToggleTheme={toggleTheme}
          onDeleteData={deleteData}
        />
        <MoodWizard
          open={wizardOpen}
          onClose={() => {
            setWizardOpen(false);
            setIsEditing(false);
          }}
          onComplete={handleWizardComplete}
          initialMood={isEditing ? mood ?? 2 : 2}
          initialEmotions={emotions}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            padding: { xs: 2, sm: 4 },
          }}
        >
          <Stack direction={'column'} sx={{ width: '100vw' }}>
            <Container
              maxWidth="sm"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: (theme) => theme.palette.background.paper,
                padding: 3,
                borderRadius: 3,
                boxShadow: 3,
                width: '100%',
                position: 'relative',
              }}
            >
              <MoodMenu onEdit={handleEdit} disabled={mood === null} />
              <DateControls
                selectedDate={selectedDate}
                moodHistory={moodHistory}
                onDateChange={handleDateChange}
                getDateForDay={getDateForDay}
                getCurrentDate={getCurrentDate}
              />
              {mood === null ? (
                <AddMoodButton onOpenWizard={() => setWizardOpen(true)} />
              ) : (
                <>
                  {mood !== null && <MoodCircle mood={mood} darkMode={darkMode ?? false} />} {/* Fallback to false if darkMode is null */}
                  <Typography
                    variant="h6"
                    sx={{
                      textAlign: 'center',
                      mt: 2,
                      color: (theme) => theme.palette.text.primary,
                    }}
                  >
                    {moodDescription}
                  </Typography>
                  {emotions.length > 0 && (
                    <Typography
                      variant="body1"
                      sx={{
                        textAlign: 'center',
                        mt: 1,
                        color: (theme) => theme.palette.text.secondary,
                      }}
                    >
                      Emotions: {emotions.join(', ')}
                    </Typography>
                  )}
                </>
              )}
            </Container>
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
