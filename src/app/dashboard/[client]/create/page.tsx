"use client";

import { useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepEnd from "./StepEnd";
import StepFour from "./StepFour";

const Page = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const onNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const onPrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne onNext={onNext} />;
      case 2:
        return <StepTwo onPrevious={onPrevious} onNext={onNext} />;
      case 3:
        return <StepThree onPrevious={onPrevious} onNext={onNext} />;
      case 4:
        return <StepFour onPrevious={onPrevious} onNext={onNext} />;
      case 5:
        return <StepEnd onPrevious={onPrevious} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full px-5 mt-4 ml-16 sm:ml-44 lg:px-10 xl:py-10">
      {renderStep()}
    </div>
  );
};

export default Page;
