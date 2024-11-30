import { useState, useEffect } from 'react';
import { load } from '@tauri-apps/plugin-store';
import { impactFeedback } from '@tauri-apps/plugin-haptics';
import { moodSettings } from '../utils/moodSettings';

export const useMood = (selectedDate: string) => {
  const [mood, setMood] = useState<number | null>(null);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [gradient, setGradient] = useState<string>('');
  const [moodHistory, setMoodHistory] = useState<{ [date: string]: { mood: number, emotions: string[] } }>({});
  const [lastHapticInterval, setLastHapticInterval] = useState<number | null>(null);
  const [isMoodLoaded, setIsMoodLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadSavedMood(selectedDate);
  }, [selectedDate]);

  const loadSavedMood = async (date: string) => {
    try {
      const store = await load('store.json', { autoSave: false });
      const savedMoodHistory = await store.get<{ [date: string]: { mood: number, emotions: string[] } }>('moodHistory');

      if (savedMoodHistory) {
        setMoodHistory(savedMoodHistory);
        const currentMoodData = savedMoodHistory[date];

        if (currentMoodData && currentMoodData.mood in moodSettings) {
          setMood(currentMoodData.mood);
          setEmotions(currentMoodData.emotions);
          setGradient(moodSettings[currentMoodData.mood].gradient);
        } else {
          setMood(null); // Ensure no mood is set for unsaved dates
          setEmotions([]);
          setGradient('');
        }
      } else {
        setMood(null); // No saved mood history
        setEmotions([]);
        setGradient('');
      }

      setIsMoodLoaded(true);
    } catch (e) {
      console.error('Error loading mood:', e);
      setMood(null);
      setEmotions([]);
      setGradient('');
      setIsMoodLoaded(true);
    }
  };

  const handleMoodChange = async (value: number) => {
    if (!(value in moodSettings)) {
      console.error('Invalid mood value:', value);
      return;
    }

    setMood(value);
    setGradient(moodSettings[value].gradient);

    const interval = Math.round(value * 100);
    if (interval !== lastHapticInterval) {
      setLastHapticInterval(interval);
      impactFeedback('light');
    }

    const newMoodHistory = {
      ...moodHistory,
      [selectedDate]: { mood: value, emotions },
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

  const handleEmotionsChange = async (newEmotions: string[]) => {
    setEmotions(newEmotions);

    const newMoodHistory = {
      ...moodHistory,
      [selectedDate]: { mood: mood ?? 2, emotions: newEmotions },
    };
    setMoodHistory(newMoodHistory);

    try {
      const store = await load('store.json', { autoSave: false });
      await store.set('moodHistory', newMoodHistory);
      await store.save();
    } catch (e) {
      console.error('Error saving emotions:', e);
    }
  };

  const deleteData = async () => {
    try {
      const store = await load('store.json', { autoSave: false });
      await store.delete('moodHistory');
      await store.save();
      setMoodHistory({});
      setMood(null);
      setEmotions([]);
      setGradient('');
    } catch (e) {
      console.error('Error deleting mood data:', e);
    }
  };

  return {
    mood,
    emotions,
    gradient: gradient || moodSettings[2]?.gradient || 'default-gradient',
    moodHistory,
    handleMoodChange,
    handleEmotionsChange,
    deleteData,
    isMoodLoaded,
  };
};
