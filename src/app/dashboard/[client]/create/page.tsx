"use client";

import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepEnd from "./StepEnd";
import StepFour from "./StepFour";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useClientStore, useProjectStore } from "@/store";
import { Skeleton } from "@/components/ui/skeleton";

const Page = () => {
  const searchParams = useSearchParams();
  const currentStep = parseInt(searchParams.get("step") ?? "0");
  const projectIdParamas = searchParams.get("projectid");
  const pathname = usePathname();
  const router = useRouter();
  const { client } = useClientStore();
  const { project } = useProjectStore();
  console.log(pathname);

  const totalSteps = 4; // Total number of steps excluding the last step
  const progressBarWidth = ((currentStep - 1) / totalSteps) * 100;

  let transitionDuration = "0.3s";
  if (currentStep === 3) {
    transitionDuration = "5s";
  }

  const onNext = () => {
    router.push(
      `${pathname}?projectid=${projectIdParamas}&step=${currentStep + 1}`
    );
  };

  const onPrevious = () => {
    router.push(
      `${pathname}?projectid=${projectIdParamas}&step=${currentStep - 1}`
    );
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
    <div className="w-full px-16 mt-8">
      <Breadcrumb className="font-montserrat capitalize mb-4">
        <BreadcrumbList className="text-lg">
          <BreadcrumbItem>
            <BreadcrumbLink href={`/dashboard/${client?.id}`}>
              {client?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>
              {project?.name ? (
                project?.name
              ) : (
                <Skeleton className="h-4 w-[20px]" />
              )}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col">
        <div className="w-full bg-[#E8E8E8]  rounded-full">
          <div
            className="progressbar rounded-full  p-[0.15rem]"
            style={{
              width: `${progressBarWidth}%`,
              transitionDuration: transitionDuration,
            }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 px-1">
          <div className="bg-[#E8E8E8]  rounded-full p-1"></div>
          <div className="bg-[#E8E8E8]  rounded-full p-1"></div>
          <div className="bg-[#E8E8E8]  rounded-full p-1"></div>
          <div className="bg-[#E8E8E8]  rounded-full p-1"></div>
        </div>
      </div>
      {renderStep()}
    </div>
  );
};

export default Page;
