"use client";

import { Icons } from "@/components/ui/Icons";
import { useState } from "react";
import Navbar from "@/components/Customcomponent/Navbar";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepEnd from "./StepEnd";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

const Page = () => {
  const [mini, setMini] = useState(true);
  const toggleSidebar = () => {
    setMini((prevState) => !prevState);
  };

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
  });

  const onNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const onPrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            onNext={onNext}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 2:
        return (
          <StepTwo
            onPrevious={onPrevious}
            onNext={onNext}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 3:
        return (
          <StepThree
            onPrevious={onPrevious}
            onNext={onNext}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 4:
        return <StepEnd onPrevious={onPrevious} formData={formData} />;
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
