import { useState, useEffect } from 'react';
import { load } from '@tauri-apps/plugin-store';
import { impactFeedback } from '@tauri-apps/plugin-haptics';
import { moodSettings } from '../utils/moodSettings';

export const useMood = (selectedDate: string) => {
  const [mood, setMood] = useState<number | null>(null);  // Start with null to track if mood is set
  const [gradient, setGradient] = useState<string>('');
  const [moodHistory, setMoodHistory] = useState<{ [date: string]: number }>({});
  const [lastHapticInterval, setLastHapticInterval] = useState<number | null>(null);

  useEffect(() => {
    loadSavedMood();  // Load saved mood data when the component mounts
  }, [selectedDate]);

  const loadSavedMood = async () => {
    try {
      const store = await load('store.json', { autoSave: false });
      const savedMoodHistory = await store.get<{ [date: string]: number }>('moodHistory');
      
      if (savedMoodHistory) {
        setMoodHistory(savedMoodHistory);
        const currentMood = savedMoodHistory[selectedDate]; // Get the mood for the selected date
        if (currentMood !== undefined) {
          setMood(currentMood);  // Set the mood from history if available
          setGradient(moodSettings[currentMood].gradient);
        } else {
          // If no mood is set, do not reset to neutral (keep the current mood state)
          if (mood === null) {
            setMood(2);  // Set to neutral if no mood found in history and no existing mood
            setGradient(moodSettings[2].gradient);
          }
        }
      }
    } catch (e) {
      console.error('Error loading mood:', e);
    }
  };

  const handleMoodChange = async (value: number) => {
    setMood(value);
    setGradient(moodSettings[value].gradient);
    
    const interval = Math.round(value * 100);
    if (interval !== lastHapticInterval) {
      setLastHapticInterval(interval);
      impactFeedback('light');
    }

    // Create new history object with explicit number value
    const newMoodHistory = { 
      ...moodHistory, 
      [selectedDate]: value 
    };
    setMoodHistory(newMoodHistory);

    try {
      const store = await load('store.json', { autoSave: false });
      await store.set('moodHistory', newMoodHistory);
      await store.save();
    } catch (e) {
      console.error('Error saving mood:', e);
    }
  };

  const deleteData = async () => {
    try {
      const store = await load('store.json', { autoSave: false });
      await store.delete('moodHistory');
      await store.save();
      setMoodHistory({});
    } catch (e) {
      console.error('Error deleting mood data:', e);
    }
  };

  return { mood, gradient, moodHistory, setMoodHistory, handleMoodChange, loadSavedMood, deleteData };
};
