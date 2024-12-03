import { useState } from "react";

export const useTour = () => {
  const [showTour, setShowTour] = useState(() => {
    return !localStorage.getItem("tourCompleted");
  });

  const handleTourComplete = () => {
    console.log("Tour complete");
    localStorage.setItem("tourCompleted", "true");
    setShowTour(false);
  };

  const handleTourSkip = () => {
    console.log("Tour skipped");
    localStorage.setItem("tourCompleted", "true");
    setShowTour(false);
  };

  const resetTour = () => {
    localStorage.removeItem("tourCompleted");
    setShowTour(true);
  };

  return {
    showTour,
    setShowTour,
    handleTourComplete,
    handleTourSkip,
    resetTour,
  };
};
