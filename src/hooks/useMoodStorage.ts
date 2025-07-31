import { useState, useEffect, useCallback } from "react";
import { moodStorage, MoodData, MoodEntry } from "../utils/moodStorage";

export interface UseMoodStorageReturn {
  moods: MoodData;
  loading: boolean;
  error: string | null;
  saveMood: (date: Date, moodIndex: number) => Promise<void>;
  getMood: (date: Date) => Promise<MoodEntry | null>;
  deleteMood: (date: Date) => Promise<void>;
  clearAllMoods: () => Promise<void>;
  refreshMoods: () => Promise<void>;
  getMoodForDate: (date: number) => number | undefined; // Helper for current week display
  moodsByDate: Record<number, number>; // For compatibility with existing DatePicker
}

export const useMoodStorage = (): UseMoodStorageReturn => {
  const [moods, setMoods] = useState<MoodData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial moods
  const loadMoods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allMoods = await moodStorage.getAllMoods();
      setMoods(allMoods);
    } catch (err) {
      console.error("Failed to load moods:", err);
      setError(err instanceof Error ? err.message : "Failed to load moods");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    loadMoods();
  }, [loadMoods]);

  // Save mood
  const saveMoodHandler = useCallback(async (date: Date, moodIndex: number) => {
    try {
      setError(null);
      await moodStorage.saveMood(date, moodIndex);

      // Update local state
      const dateKey = date.toISOString().split("T")[0];
      const moodEntry: MoodEntry = {
        date: dateKey,
        moodIndex,
        timestamp: Date.now(),
      };

      setMoods((prev) => ({
        ...prev,
        [dateKey]: moodEntry,
      }));
    } catch (err) {
      console.error("Failed to save mood:", err);
      setError(err instanceof Error ? err.message : "Failed to save mood");
      throw err;
    }
  }, []);

  // Get mood for specific date
  const getMoodHandler = useCallback(
    async (date: Date): Promise<MoodEntry | null> => {
      try {
        setError(null);
        return await moodStorage.getMood(date);
      } catch (err) {
        console.error("Failed to get mood:", err);
        setError(err instanceof Error ? err.message : "Failed to get mood");
        return null;
      }
    },
    []
  );

  // Delete mood
  const deleteMoodHandler = useCallback(async (date: Date) => {
    try {
      setError(null);
      await moodStorage.deleteMood(date);

      // Update local state
      const dateKey = date.toISOString().split("T")[0];
      setMoods((prev) => {
        const updated = { ...prev };
        delete updated[dateKey];
        return updated;
      });
    } catch (err) {
      console.error("Failed to delete mood:", err);
      setError(err instanceof Error ? err.message : "Failed to delete mood");
      throw err;
    }
  }, []);

  // Clear all moods
  const clearAllMoodsHandler = useCallback(async () => {
    try {
      setError(null);
      await moodStorage.clearAllMoods();
      setMoods({});
    } catch (err) {
      console.error("Failed to clear moods:", err);
      setError(err instanceof Error ? err.message : "Failed to clear moods");
      throw err;
    }
  }, []);

  // Refresh moods from storage
  const refreshMoods = useCallback(async () => {
    await loadMoods();
  }, [loadMoods]);

  // Helper function to get mood index for a specific date (day of month)
  const getMoodForDate = useCallback(
    (date: number): number | undefined => {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      // Create date key in YYYY-MM-DD format
      const dateKey = `${currentYear}-${currentMonth
        .toString()
        .padStart(2, "0")}-${date.toString().padStart(2, "0")}`;

      return moods[dateKey]?.moodIndex;
    },
    [moods]
  );

  // Create moodsByDate object for compatibility with existing DatePicker component
  const moodsByDate = useCallback((): Record<number, number> => {
    const result: Record<number, number> = {};
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    Object.entries(moods).forEach(([dateKey, moodEntry]) => {
      const [year, month, day] = dateKey.split("-").map(Number);

      // Only include current month's moods
      if (year === currentYear && month === currentMonth) {
        result[day] = moodEntry.moodIndex;
      }
    });

    return result;
  }, [moods]);

  return {
    moods,
    loading,
    error,
    saveMood: saveMoodHandler,
    getMood: getMoodHandler,
    deleteMood: deleteMoodHandler,
    clearAllMoods: clearAllMoodsHandler,
    refreshMoods,
    getMoodForDate,
    moodsByDate: moodsByDate(),
  };
};

// Additional hook for mood statistics
export const useMoodStats = () => {
  const [stats, setStats] = useState({
    totalEntries: 0,
    moodCounts: {} as Record<number, number>,
    averageMood: 0,
    mostCommonMood: 0,
  });
  const [loading, setLoading] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const moodStats = await moodStorage.getMoodStats();
      setStats(moodStats);
    } catch (error) {
      console.error("Failed to load mood stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    refreshStats: loadStats,
  };
};
