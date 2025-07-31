import { useEffect, useState, useCallback } from "react";
import { dayService, DayInfo } from "../utils/dayService";

export interface UseDayServiceReturn {
  currentDay: DayInfo;
  weekData: DayInfo[];
  isNewDay: boolean;
  checkForNewDay: () => boolean;
  refreshData: () => void;
}

export const useDayService = (autoMonitor = true): UseDayServiceReturn => {
  const [currentDay, setCurrentDay] = useState<DayInfo>(() =>
    dayService.getCurrentDayInfo()
  );
  const [weekData, setWeekData] = useState<DayInfo[]>(() =>
    dayService.getWeekData()
  );
  const [isNewDay, setIsNewDay] = useState<boolean>(false);

  const refreshData = useCallback(() => {
    const newCurrentDay = dayService.getCurrentDayInfo();
    const newWeekData = dayService.getWeekData();

    setCurrentDay(newCurrentDay);
    setWeekData(newWeekData);
    setIsNewDay(newCurrentDay.isNewDay);
  }, []);

  const checkForNewDay = useCallback(() => {
    const isNew = dayService.checkForNewDay();
    if (isNew) {
      refreshData();
    }
    return isNew;
  }, [refreshData]);

  useEffect(() => {
    // Subscribe to new day events
    const unsubscribe = dayService.onNewDay((dayInfo) => {
      setCurrentDay(dayInfo);
      setWeekData(dayService.getWeekData());
      setIsNewDay(true);

      // Reset isNewDay flag after a short delay
      setTimeout(() => setIsNewDay(false), 5000);
    });

    // Start monitoring if enabled
    if (autoMonitor) {
      dayService.startDayMonitoring();
    }

    // Cleanup
    return () => {
      unsubscribe();
      if (autoMonitor) {
        dayService.stopDayMonitoring();
      }
    };
  }, [autoMonitor]);

  // Refresh data when component mounts or day changes
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    currentDay,
    weekData,
    isNewDay,
    checkForNewDay,
    refreshData,
  };
};

// Hook specifically for new day detection
export const useNewDayDetection = (onNewDay?: (dayInfo: DayInfo) => void) => {
  const [isNewDay, setIsNewDay] = useState<boolean>(false);
  const [currentDay, setCurrentDay] = useState<DayInfo>(() =>
    dayService.getCurrentDayInfo()
  );

  useEffect(() => {
    const unsubscribe = dayService.onNewDay((dayInfo) => {
      setCurrentDay(dayInfo);
      setIsNewDay(true);

      // Call optional callback
      if (onNewDay) {
        onNewDay(dayInfo);
      }

      // Reset flag after 3 seconds
      setTimeout(() => setIsNewDay(false), 3000);
    });

    // Start monitoring
    dayService.startDayMonitoring();

    return () => {
      unsubscribe();
      dayService.stopDayMonitoring();
    };
  }, [onNewDay]);

  const checkNow = useCallback(() => {
    return dayService.checkForNewDay();
  }, []);

  return {
    isNewDay,
    currentDay,
    checkNow,
  };
};
