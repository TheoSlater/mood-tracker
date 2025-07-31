export interface DayInfo {
  date: number;
  dayName: string;
  dayAbbrev: string;
  month: number;
  year: number;
  isToday: boolean;
  isNewDay: boolean;
  timestamp: number;
}

export class DayService {
  private lastCheckedDate: string | null = null;
  private callbacks: Set<(dayInfo: DayInfo) => void> = new Set();
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.initializeLastCheckedDate();
  }

  /**
   * Initialize with current date
   */
  private initializeLastCheckedDate(): void {
    this.lastCheckedDate = new Date().toDateString();
  }

  /**
   * Get current day information
   */
  getCurrentDayInfo(): DayInfo {
    const now = new Date();
    const currentDateString = now.toDateString();
    const isNewDay = this.lastCheckedDate !== currentDateString;

    const dayInfo: DayInfo = {
      date: now.getDate(),
      dayName: this.getDayName(now.getDay()),
      dayAbbrev: this.getDayAbbrev(now.getDay()),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      isToday: true,
      isNewDay,
      timestamp: now.getTime(),
    };

    // Update last checked date if it's a new day
    if (isNewDay) {
      this.lastCheckedDate = currentDateString;
    }

    return dayInfo;
  }

  /**
   * Check if it's a new day since last check
   */
  checkForNewDay(): boolean {
    const currentDateString = new Date().toDateString();
    const isNewDay = this.lastCheckedDate !== currentDateString;

    if (isNewDay) {
      this.lastCheckedDate = currentDateString;
      this.notifyCallbacks();
    }

    return isNewDay;
  }

  /**
   * Get day information for a specific date
   */
  getDayInfo(date: Date): DayInfo {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    return {
      date: date.getDate(),
      dayName: this.getDayName(date.getDay()),
      dayAbbrev: this.getDayAbbrev(date.getDay()),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      isToday,
      isNewDay: false, // Only relevant for current day checks
      timestamp: date.getTime(),
    };
  }

  /**
   * Get week data starting from Monday
   */
  getWeekData(): DayInfo[] {
    const today = new Date();
    const startOfWeek = this.getStartOfWeek(today);
    const weekData: DayInfo[] = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      weekData.push(this.getDayInfo(currentDate));
    }

    return weekData;
  }

  /**
   * Subscribe to new day notifications
   */
  onNewDay(callback: (dayInfo: DayInfo) => void): () => void {
    this.callbacks.add(callback);

    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback);
    };
  }

  /**
   * Start automatic day checking (checks every minute)
   */
  startDayMonitoring(): void {
    if (this.intervalId) {
      this.stopDayMonitoring();
    }

    this.intervalId = setInterval(() => {
      this.checkForNewDay();
    }, 60000); // Check every minute
  }

  /**
   * Stop automatic day checking
   */
  stopDayMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Check if a date is today
   */
  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  /**
   * Check if a date is in the current week
   */
  isCurrentWeek(date: Date): boolean {
    const today = new Date();
    const startOfWeek = this.getStartOfWeek(today);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return date >= startOfWeek && date <= endOfWeek;
  }

  /**
   * Get the start of the week (Monday)
   */
  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  /**
   * Get full day name
   */
  private getDayName(dayIndex: number): string {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dayIndex];
  }

  /**
   * Get abbreviated day name
   */
  private getDayAbbrev(dayIndex: number): string {
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    return days[dayIndex];
  }

  /**
   * Notify all subscribers of a new day
   */
  private notifyCallbacks(): void {
    const dayInfo = this.getCurrentDayInfo();
    this.callbacks.forEach((callback) => {
      try {
        callback(dayInfo);
      } catch (error) {
        console.error("Error in day service callback:", error);
      }
    });
  }

  /**
   * Reset the service (useful for testing or manual resets)
   */
  reset(): void {
    this.lastCheckedDate = new Date().toDateString();
    this.callbacks.clear();
    this.stopDayMonitoring();
  }
}

// Create a singleton instance
export const dayService = new DayService();

// Utility functions for easy access
export const getCurrentDay = () => dayService.getCurrentDayInfo();
export const checkNewDay = () => dayService.checkForNewDay();
export const getWeekData = () => dayService.getWeekData();
export const isToday = (date: Date) => dayService.isToday(date);
export const isCurrentWeek = (date: Date) => dayService.isCurrentWeek(date);
