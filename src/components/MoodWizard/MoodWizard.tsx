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
} from '@mui/material';
import MoodSlider from '../MoodSlider';
import MoodCircle from '../MoodCircle'; // Import MoodCircle
import EmotionSelector from './EmotionSelector';

interface MoodWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete: (data: { mood: number; emotions: string[] }) => void;
  initialMood?: number;
  initialEmotions?: string[];
}

const steps = ['Rate Your Day', 'Select Emotions'];

export default function MoodWizard({ 
    open, 
    onClose, 
    onComplete, 
    initialMood = 2, 
    initialEmotions = [] 
  }: MoodWizardProps) {
    const [activeStep, setActiveStep] = useState(0);
    const [mood, setMood] = useState(initialMood);
    const [emotions, setEmotions] = useState<string[]>(initialEmotions);
  
    const darkMode = false; // Replace this with your actual dark mode state
  
    useEffect(() => {
      if (open) {
        setMood(initialMood);
        setEmotions(initialEmotions);
        setActiveStep(0);
      }
    }, [open, initialMood, initialEmotions]);
  
    const handleNext = () => {
      if (activeStep === steps.length - 1) {
        onComplete({ mood, emotions });
        onClose();
      } else {
        setActiveStep((prev) => prev + 1);
      }
    };
  
    const handleBack = () => {
      setActiveStep((prev) => prev - 1);
    };
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>
          {initialMood !== undefined ? 'Edit Mood' : 'Add Today\'s Mood'}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5, width: '100%' }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
  
            {activeStep === 0 ? (
              <>
                <MoodCircle mood={mood} darkMode={darkMode} /> {/* Add MoodCircle */}
                <MoodSlider
                  mood={mood}
                  handleMoodChange={(newMood) => setMood(newMood)}
                  gradient={`${mood < 2 ? '#ff6b6b, #ff9f9f' : mood > 2 ? '#4cd964, #7bed9f' : '#ffcc66, #ffd983'}`}
                />
              </>
            ) : (
              <EmotionSelector 
                onEmotionsChange={setEmotions}
                initialEmotions={emotions}
              />
            )}
  
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 1 }}>
              {activeStep !== 0 && (
                <Button onClick={handleBack}>Back</Button>
              )}
              <Button
                variant="contained"
                onClick={handleNext}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }
  