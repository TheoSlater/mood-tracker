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
    const { selectedDate, handleDateChange, getDateForDay } = useDate();
    const { mood, gradient, moodHistory, setMoodHistory, handleMoodChange, loadSavedMood, deleteData } = useMood(selectedDate);
    const { darkMode, toggleTheme } = useTheme();
    const [settingsOpen, setSettingsOpen] = useState(false);

    useEffect(() => {
      loadSavedMood();
    }, [selectedDate]);

    if (darkMode === null) {
      return null;
    }

    const handleDaySelect = (index: number) => {
      const newDate = getDateForDay(index);
      handleDateChange('today');
      handleMoodChange(moodHistory[newDate] || 2);
    };

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
              <DateControls
                handleDateChange={handleDateChange}
                mood={mood}
                onDaySelect={handleDaySelect}
                moodHistory={moodHistory}
                setMoodHistory={setMoodHistory}
                selectedDate={selectedDate}
              />
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
                <MoodCircle mood={mood} darkMode={darkMode} />
                <MoodSlider
                  mood={mood}
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