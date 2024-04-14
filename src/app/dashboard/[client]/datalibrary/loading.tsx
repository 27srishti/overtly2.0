import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="w-full px-16 mt-4">
      <div className="flex gap-16 mt-11 mb-14">
        <Skeleton className="h-10 w-[100px]" />

        <Skeleton className="h-10 w-[100px]" />
      </div>
      <div className="mt-7 max-w-[70vw]">
        <Skeleton className="h-[30vh] w-full" />
      </div>
    </div>
  );
};

export default Loading;
