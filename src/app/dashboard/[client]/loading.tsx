import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
  return (
    <div className="w-full px-5 mt-4">
      <div className="text-3xl font-bold mt-4 ml-2">
        <Skeleton className="h-10 w-[100px]" />
      </div>

      <Skeleton className="h-9 mt-5 ml-2 w-[100px]" />

      <div className="grid grid-cols-1 mt-5 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4">
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <Skeleton className="h-[125px] w-full rounded-xl" />
      </div>
    </div>
  );
};

export default loading;
