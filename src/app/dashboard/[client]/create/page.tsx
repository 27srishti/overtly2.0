"use client";

import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepEnd from "./StepEnd";
import StepFour from "./StepFour";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();
  const currentStep = parseInt(searchParams.get("step") ?? "0");
  const project = searchParams.get("projectid");
  const pathname = usePathname();
  const router = useRouter();

  console.log(pathname);
  const onNext = () => {
    router.push(`${pathname}?projectid=${project}&step=${currentStep + 1}`);
  };

  const onPrevious = () => {
    router.push(`${pathname}?projectid=${project}&step=${currentStep - 1}`);
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
