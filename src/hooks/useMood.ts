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

        if (currentMoodData) {
          setMood(currentMoodData.mood);
          setEmotions(currentMoodData.emotions);
          setGradient(moodSettings[currentMoodData.mood].gradient);
        } else {
          setMood(null);
          setEmotions([]);
          setGradient(moodSettings[2].gradient);
        }
      } else {
        setMood(null);
        setEmotions([]);
        setGradient(moodSettings[2].gradient);
      }

      setIsMoodLoaded(true);
    } catch (e) {
      console.error('Error loading mood:', e);
      setIsMoodLoaded(true);
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

    const newMoodHistory = {
      ...moodHistory,
      [selectedDate]: { mood: value, emotions }
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
      [selectedDate]: { mood: mood ?? 2, emotions: newEmotions }
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
    } catch (e) {
      console.error('Error deleting mood data:', e);
    }
  };

  return {
    mood,
    emotions,
    gradient,
    moodHistory,
    handleMoodChange,
    handleEmotionsChange,
    deleteData,
    isMoodLoaded,
  };
};

