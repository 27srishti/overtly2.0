import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
  return (
    <div className="w-full px-5 mt-4 ml-16 sm:ml-44">
      <div>
        <div className="text-3xl font-bold mt-4 lg:ml-32">
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <div className="ml-2 lg:ml-32 mt-4">
          <Skeleton className="h-9 w-[100px] " />
        </div>
        <div className="flex flex-col items-center">
          <Skeleton className="h-[125px] w-[250px] rounded-xl ml-auto mr-auto" />
        </div>
      </div>
      <div className="mt-7">
        <div className="mx-auto overflow-hidden max-w-[70vw]">
          <Skeleton className="h-[125px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default loading;
