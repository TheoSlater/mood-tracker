import { TourStep } from "./TourGuide";

export const getTourSteps = (username: string): TourStep[] => [
  {
    target: "#welcome-message",
    content: `Welcome ${username}! Let's take a quick tour of your mood tracking app.`,
    position: "bottom",
  },
  {
    target: "#date-controls",
    content:
      "Use these controls to navigate between different dates and view your mood history.",
    position: "bottom",
  },
  {
    target: "#mood-display",
    content:
      "This area shows your current mood and emotions for the selected date.",
    position: "right",
  },
  {
    target: "#add-mood-button",
    content: "Click here to record your mood and emotions for today.",
    position: "left",
  },
  {
    target: "#settings-button",
    content: "Access settings, toggle dark mode, and manage your data here.",
    position: "left",
  },
];
