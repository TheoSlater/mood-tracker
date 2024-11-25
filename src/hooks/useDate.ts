import { useState } from 'react';

export const useDate = () => {
  const getCurrentDate = () => new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());

  const getPreviousDate = (date: string): string => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() - 1);
    return currentDate.toISOString().split('T')[0];
  };

  const getNextDate = (date: string): string => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + 1);
    return currentDate.toISOString().split('T')[0];
  };

  const getDateForDay = (dayIndex: number): string => {
    const today = new Date();
    const dayDiff = (dayIndex - today.getDay() + 7) % 7;
    today.setDate(today.getDate() - today.getDay() + dayDiff);
    return today.toISOString().split('T')[0];
  };

  const handleDateChange = (direction: 'previous' | 'today' | 'next') => {
    let newDate;
    if (direction === 'previous') {
      newDate = getPreviousDate(selectedDate);
    } else if (direction === 'next') {
      newDate = getNextDate(selectedDate);
    } else {
      newDate = getCurrentDate();
    }
    setSelectedDate(newDate);
    return newDate;
  };

  return {
    selectedDate,
    setSelectedDate,
    handleDateChange,
    getDateForDay,
    getCurrentDate,
  };
};