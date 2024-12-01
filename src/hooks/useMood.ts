import { useState, useEffect } from 'react';
import { load } from '@tauri-apps/plugin-store';
import { impactFeedback } from '@tauri-apps/plugin-haptics';
import { moodSettings } from '../utils/moodSettings';

interface MoodData {
  mood: number;
  emotions: string[];
  journal?: string;
}

export const useMood = (selectedDate: string) => {
  const [mood, setMood] = useState<number | null>(null);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [journal, setJournal] = useState<string>('');
  const [gradient, setGradient] = useState<string>('');
  const [moodHistory, setMoodHistory] = useState<{ [date: string]: MoodData }>({});
  const [lastHapticInterval, setLastHapticInterval] = useState<number | null>(null);
  const [isMoodLoaded, setIsMoodLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadSavedMood();
  }, []);

  useEffect(() => {
    updateCurrentMood();
  }, [selectedDate, moodHistory]);

  const loadSavedMood = async () => {
    try {
      const store = await load('store.json', { autoSave: false });
      const savedMoodHistory = await store.get<{ [date: string]: MoodData }>('moodHistory');

      if (savedMoodHistory) {
        setMoodHistory(savedMoodHistory);
      }
      setIsMoodLoaded(true);
    } catch (e) {
      console.error('Error loading mood history:', e);
      setIsMoodLoaded(true);
    }
  };

  const updateCurrentMood = () => {
    const currentMoodData = moodHistory[selectedDate];
    
    if (currentMoodData && currentMoodData.mood in moodSettings) {
      setMood(currentMoodData.mood);
      setEmotions(currentMoodData.emotions || []);
      setJournal(currentMoodData.journal || '');
      setGradient(moodSettings[currentMoodData.mood].gradient);
    } else {
      setMood(null);
      setEmotions([]);
      setJournal('');
      setGradient('');
    }
  };

  const saveMoodHistory = async (newMoodHistory: typeof moodHistory) => {
    try {
      const store = await load('store.json', { autoSave: false });
      await store.set('moodHistory', newMoodHistory);
      await store.save();
    } catch (e) {
      console.error('Error saving mood history:', e);
    }
  };

  const handleMoodChange = async (value: number) => {
    if (!(value in moodSettings)) {
      console.error('Invalid mood value:', value);
      return;
    }

    const newMoodHistory = {
      ...moodHistory,
      [selectedDate]: {
        ...moodHistory[selectedDate],
        mood: value,
        emotions: moodHistory[selectedDate]?.emotions || []
      }
    };

    setMoodHistory(newMoodHistory);
    await saveMoodHistory(newMoodHistory);

    const interval = Math.round(value * 100);
    if (interval !== lastHapticInterval) {
      setLastHapticInterval(interval);
      impactFeedback('light');
    }
  };

  const handleEmotionsChange = async (newEmotions: string[]) => {
    const currentMood = moodHistory[selectedDate]?.mood ?? 2;
    
    const newMoodHistory = {
      ...moodHistory,
      [selectedDate]: {
        ...moodHistory[selectedDate],
        mood: currentMood,
        emotions: newEmotions
      }
    };

    setMoodHistory(newMoodHistory);
    await saveMoodHistory(newMoodHistory);
  };

  const handleJournalChange = async (newJournal: string) => {
    const currentMood = moodHistory[selectedDate]?.mood ?? 2;
    const currentEmotions = moodHistory[selectedDate]?.emotions || [];
    
    const newMoodHistory = {
      ...moodHistory,
      [selectedDate]: {
        mood: currentMood,
        emotions: currentEmotions,
        journal: newJournal
      }
    };

    setMoodHistory(newMoodHistory);
    await saveMoodHistory(newMoodHistory);
  };

  const deleteData = async () => {
    try {
      const store = await load('store.json', { autoSave: false });
      await store.delete('moodHistory');
      await store.save();
      setMoodHistory({});
      setMood(null);
      setEmotions([]);
      setJournal('');
      setGradient('');
    } catch (e) {
      console.error('Error deleting mood data:', e);
    }
  };

  return {
    mood,
    emotions,
    journal,
    gradient: gradient || moodSettings[2]?.gradient || 'default-gradient',
    moodHistory,
    handleMoodChange,
    handleEmotionsChange,
    handleJournalChange,
    deleteData,
    isMoodLoaded,
  };
};