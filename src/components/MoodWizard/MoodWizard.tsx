import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  IconButton,
  useTheme,
} from '@mui/material';
import { X as CloseIcon } from 'lucide-react';
import MoodSlider from '../MoodSlider';
import MoodCircle from '../MoodCircle';
import EmotionSelector from './EmotionSelector';
import JournalStep from './JournalStep';

interface MoodWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete: (data: { mood: number; emotions: string[]; journal: string }) => void;
  initialMood?: number;
  initialEmotions?: string[];
  initialJournal?: string;
}

const steps = ['Rate Your Day', 'Select Emotions', 'Add Notes'];

export default function MoodWizard({ 
  open, 
  onClose, 
  onComplete, 
  initialMood = 2, 
  initialEmotions = [],
  initialJournal = ''
}: MoodWizardProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [mood, setMood] = useState(initialMood);
  const [emotions, setEmotions] = useState<string[]>(initialEmotions);
  const [journal, setJournal] = useState(initialJournal);
  const theme = useTheme();

  useEffect(() => {
    if (open) {
      setMood(initialMood);
      setEmotions(initialEmotions);
      setJournal(initialJournal);
      setActiveStep(0);
    }
  }, [open, initialMood, initialEmotions, initialJournal]);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      onComplete({ mood, emotions, journal });
      onClose();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: theme.palette.background.paper,
          backgroundImage: 'none',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          textAlign: 'center',
          pt: 3,
          pb: 2,
          position: 'relative',
          fontSize: '1.5rem',
          fontWeight: 600
        }}
      >
        {initialMood !== undefined ? 'Edit Mood' : 'Add Today\'s Mood'}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 4, pb: 4 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}>
          <Stepper 
            activeStep={activeStep} 
            sx={{ 
              pt: 3, 
              pb: 5, 
              width: '100%',
              '& .MuiStepLabel-label': {
                fontSize: '0.875rem',
              },
              '& .MuiStepIcon-root': {
                width: '1.5rem',
                height: '1.5rem',
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ 
            minHeight: 300, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
          }}>
            {activeStep === 0 ? (
              <>
                <MoodCircle 
                  mood={mood} 
                  darkMode={theme.palette.mode === 'dark'} 
                />
                <MoodSlider
                  mood={mood}
                  handleMoodChange={setMood}
                />
              </>
            ) : activeStep === 1 ? (
              <EmotionSelector 
                onEmotionsChange={setEmotions}
                initialEmotions={emotions}
              />
            ) : (
              <JournalStep
                journal={journal}
                onJournalChange={setJournal}
              />
            )}
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 4,
            gap: 2,
            width: '100%'
          }}>
            {activeStep !== 0 && (
              <Button 
                onClick={handleBack}
                variant="outlined"
                sx={{ 
                  minWidth: 100,
                  borderRadius: 2
                }}
              >
                Back
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ 
                minWidth: 100,
                borderRadius: 2,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                }
              }}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}