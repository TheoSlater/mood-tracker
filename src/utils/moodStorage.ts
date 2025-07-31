import { Store } from "@tauri-apps/plugin-store";

export interface MoodEntry {
  date: string; // Format: 'YYYY-MM-DD'
  moodIndex: number;
  timestamp: number;
}

export interface MoodData {
  [dateKey: string]: MoodEntry;
}

class MoodStorageService {
  private store!: Store;
  private readonly STORE_KEY = "moods";
  private isInitialized = false;

  /**
   * Initialize the store - call this before using other methods
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.store = await Store.load("moods.dat");
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize mood storage:", error);
      throw error;
    }
  }
  /**
   * Save a mood for a specific date
   */
  async saveMood(date: Date, moodIndex: number): Promise<void> {
    await this.initialize();

    const dateKey = this.formatDateKey(date);
    const moodEntry: MoodEntry = {
      date: dateKey,
      moodIndex,
      timestamp: Date.now(),
    };

    try {
      // Get existing moods
      const existingMoods = await this.getAllMoods();

      // Update with new mood
      const updatedMoods = {
        ...existingMoods,
        [dateKey]: moodEntry,
      };

      // Save to store
      await this.store.set(this.STORE_KEY, updatedMoods);
      await this.store.save();

      console.log(`Mood saved for ${dateKey}:`, moodEntry);
    } catch (error) {
      console.error("Failed to save mood:", error);
      throw error;
    }
  }

  /**
   * Get mood for a specific date
   */
  async getMood(date: Date): Promise<MoodEntry | null> {
    await this.initialize();

    const dateKey = this.formatDateKey(date);

    try {
      const moods = await this.getAllMoods();
      return moods[dateKey] || null;
    } catch (error) {
      console.error("Failed to get mood:", error);
      return null;
    }
  }

  /**
   * Get all moods
   */
  async getAllMoods(): Promise<MoodData> {
    await this.initialize();

    try {
      const moods = await this.store.get<MoodData>(this.STORE_KEY);
      return moods || {};
    } catch (error) {
      console.error("Failed to get all moods:", error);
      return {};
    }
  }

  /**
   * Get moods for a date range
   */
  async getMoodsInRange(startDate: Date, endDate: Date): Promise<MoodData> {
    const allMoods = await this.getAllMoods();
    const filteredMoods: MoodData = {};

    const startKey = this.formatDateKey(startDate);
    const endKey = this.formatDateKey(endDate);

    Object.entries(allMoods).forEach(([dateKey, moodEntry]) => {
      if (dateKey >= startKey && dateKey <= endKey) {
        filteredMoods[dateKey] = moodEntry;
      }
    });

    return filteredMoods;
  }

  /**
   * Delete mood for a specific date
   */
  async deleteMood(date: Date): Promise<void> {
    await this.initialize();

    const dateKey = this.formatDateKey(date);

    try {
      const moods = await this.getAllMoods();
      delete moods[dateKey];

      await this.store.set(this.STORE_KEY, moods);
      await this.store.save();

      console.log(`Mood deleted for ${dateKey}`);
    } catch (error) {
      console.error("Failed to delete mood:", error);
      throw error;
    }
  }

  /**
   * Clear all moods
   */
  async clearAllMoods(): Promise<void> {
    await this.initialize();

    try {
      await this.store.set(this.STORE_KEY, {});
      await this.store.save();
      console.log("All moods cleared");
    } catch (error) {
      console.error("Failed to clear moods:", error);
      throw error;
    }
  }

  /**
   * Export moods as JSON
   */
  async exportMoods(): Promise<string> {
    const moods = await this.getAllMoods();
    return JSON.stringify(moods, null, 2);
  }

  /**
   * Import moods from JSON
   */
  async importMoods(
    jsonData: string,
    overwrite: boolean = false
  ): Promise<void> {
    await this.initialize();

    try {
      const importedMoods: MoodData = JSON.parse(jsonData);

      let finalMoods: MoodData;

      if (overwrite) {
        finalMoods = importedMoods;
      } else {
        const existingMoods = await this.getAllMoods();
        finalMoods = { ...existingMoods, ...importedMoods };
      }

      await this.store.set(this.STORE_KEY, finalMoods);
      await this.store.save();

      console.log("Moods imported successfully");
    } catch (error) {
      console.error("Failed to import moods:", error);
      throw error;
    }
  }

  /**
   * Get mood statistics
   */
  async getMoodStats(): Promise<{
    totalEntries: number;
    moodCounts: Record<number, number>;
    averageMood: number;
    mostCommonMood: number;
  }> {
    const moods = await this.getAllMoods();
    const entries = Object.values(moods);

    if (entries.length === 0) {
      return {
        totalEntries: 0,
        moodCounts: {},
        averageMood: 0,
        mostCommonMood: 0,
      };
    }

    const moodCounts: Record<number, number> = {};
    let totalMoodValue = 0;

    entries.forEach((entry) => {
      moodCounts[entry.moodIndex] = (moodCounts[entry.moodIndex] || 0) + 1;
      totalMoodValue += entry.moodIndex;
    });

    const averageMood = totalMoodValue / entries.length;
    const mostCommonMood = Object.entries(moodCounts).reduce((a, b) =>
      moodCounts[parseInt(a[0])] > moodCounts[parseInt(b[0])] ? a : b
    )[0];

    return {
      totalEntries: entries.length,
      moodCounts,
      averageMood,
      mostCommonMood: parseInt(mostCommonMood),
    };
  }

  /**
   * Format date as key (YYYY-MM-DD)
   */
  private formatDateKey(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  /**
   * Parse date key back to Date object
   * TODO: COMPLETE THIS
   */
  // private parseDateKey(dateKey: string): Date {
  //   return new Date(dateKey + "T00:00:00.000Z");
  // }
}

// Create singleton instance
export const moodStorage = new MoodStorageService();

// Helper functions for easy access
export const saveMood = (date: Date, moodIndex: number) =>
  moodStorage.saveMood(date, moodIndex);
export const getMood = (date: Date) => moodStorage.getMood(date);
export const getAllMoods = () => moodStorage.getAllMoods();
export const getMoodStats = () => moodStorage.getMoodStats();
export const clearAllMoods = () => moodStorage.clearAllMoods();
