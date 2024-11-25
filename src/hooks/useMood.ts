import { useState } from 'react';
import { load } from '@tauri-apps/plugin-store';
import { impactFeedback } from '@tauri-apps/plugin-haptics';
import { moodSettings } from '../utils/moodSettings';

export const useMood = (selectedDate: string) => {
  const [mood, setMood] = useState<number>(2);
  const [gradient, setGradient] = useState<string>(moodSettings[mood].gradient);
  const [moodHistory, setMoodHistory] = useState<{ [date: string]: number }>({});
  const [lastHapticInterval, setLastHapticInterval] = useState<number | null>(null);

  const loadSavedMood = async () => {
    try {
      const store = await load('store.json', { autoSave: false });
      const savedMoodHistory = await store.get<{ [date: string]: number }>('moodHistory');
      if (savedMoodHistory) {
        setMoodHistory(savedMoodHistory);
        // Finally fixedd this issue where 'sad' isnt being saved
        const currentMood = typeof savedMoodHistory[selectedDate] === 'number' ? 
          savedMoodHistory[selectedDate] : 2;
        setMood(currentMood);
        setGradient(moodSettings[currentMood].gradient);
      }
    } catch (e) {
      console.error('Error loading mood:', e);
    }
  };

  const handleMoodChange = async (value: number) => {
    // Ensure value is treated as a number
    const numericValue = Number(value);
    setMood(numericValue);
    setGradient(moodSettings[numericValue].gradient);
    
    const interval = Math.round(numericValue * 100);
    if (interval !== lastHapticInterval) {
      setLastHapticInterval(interval);
      impactFeedback('light');
    }

    // Create new history object with explicit number value
    const newMoodHistory = { 
      ...moodHistory, 
      [selectedDate]: numericValue 
    };
    setMoodHistory(newMoodHistory);

    try {
      const store = await load('store.json', { autoSave: false });
      // Explicitly save as number
      await store.set('moodHistory', newMoodHistory);
      await store.save();
    } catch (e) {
      console.error('Error saving mood:', e);
    }
  };

  const resetData = async () => {
    try {
      const store = await load('store.json', { autoSave: false });
      await store.set('moodHistory', {});
      await store.save();
      setMoodHistory({});
      setMood(2); // Reset to neutral
      setGradient(moodSettings[2].gradient);
      impactFeedback('light');
      alert('Data has been reset');
    } catch (e) {
      console.error('Error resetting data:', e);
    }
  };

  const deleteData = async () => {
    try {
      const store = await load('store.json', { autoSave: false });
      await store.clear();
      await store.save();
      setMoodHistory({});
      setMood(2);
      setGradient(moodSettings[2].gradient);
      impactFeedback('light');
      alert('All data has been deleted');
      window.location.reload();
    } catch (e) {
      console.error('Error deleting data:', e);
    }
  };

  return {
    mood,
    setMood,
    gradient,
    moodHistory,
    setMoodHistory,
    handleMoodChange,
    loadSavedMood,
    resetData,
    deleteData,
  };
};