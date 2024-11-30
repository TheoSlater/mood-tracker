import { useState } from 'react';

export const useDate = () => {
  const getCurrentDate = () => new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());

  const getDateForDay = (dayIndex: number): string => {
    const today = new Date();
    const dayDiff = (dayIndex - today.getDay() + 7) % 7;
    today.setDate(today.getDate() - today.getDay() + dayDiff);
    return today.toISOString().split('T')[0];
  };

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
  };

  return {
    selectedDate,
    setSelectedDate,
    handleDateChange,
    getDateForDay,
    getCurrentDate,
  };
};
