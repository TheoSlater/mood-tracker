import React from "react";
import { TourStep } from "./TourStep";

export interface TourStep {
  target: string;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

interface TourGuideProps {
  steps: TourStep[];
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const TourGuide: React.FC<TourGuideProps> = ({
  steps,
  isOpen,
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = React.useState(0);

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    setCurrentStep(0);
    onSkip();
  };

  React.useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  return (
    <>
      {steps.map((step, index) => (
        <TourStep
          key={index}
          {...step}
          isVisible={isOpen && currentStep === index}
          onNext={handleNext}
          onSkip={handleSkip}
        />
      ))}
    </>
  );
};
