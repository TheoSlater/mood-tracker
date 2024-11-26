import { useEffect, useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Container, Stack } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import MoodSlider from './components/MoodSlider';
import DateControls from './components/DateControls';
import MoodCircle from './components/MoodCircle';
import SettingsButton from './components/Settings/SettingsButton';
import SettingsDialog from './components/Settings/SettingsDialog';
import { useMood } from './hooks/useMood';
import { useTheme } from './hooks/useTheme';
import { useDate } from './hooks/useDate';

function App() {
  const { selectedDate, handleDateChange, getDateForDay, getCurrentDate } = useDate();
  const { mood, gradient, moodHistory, handleMoodChange, loadSavedMood, deleteData } = useMood(selectedDate);
  const { darkMode, toggleTheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    loadSavedMood();
  }, [selectedDate]);

  if (darkMode === null) {
    return null;
  }



  // Provide fallback value if mood is null
  const currentMood = mood === null ? 2 : mood;  // Fallback to neutral (2)

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
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
          onDeleteData={deleteData}
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
              }}
            >
              <DateControls
                selectedDate={selectedDate}
                moodHistory={moodHistory}
                onDateChange={handleDateChange}
                getDateForDay={getDateForDay}
                getCurrentDate={getCurrentDate}
              />
              <MoodCircle mood={currentMood} darkMode={darkMode} />
              <MoodSlider
                mood={currentMood}
                handleMoodChange={handleMoodChange}
                gradient={gradient}
              />
            </Container>
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;