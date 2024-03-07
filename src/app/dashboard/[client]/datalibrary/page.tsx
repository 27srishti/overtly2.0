import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/button";
import React from "react";
import Table from "./Table";

const page = () => {
  return (
    <div className="w-full px-5 mt-4 ml-16 sm:ml-44">
      <div className="text-3xl font-bold mt-4 lg:ml-32">Create a project</div>
      <div className="ml-2 lg:ml-32">Client Name - Apple</div>
      <div className="flex flex-col items-center">
        <div className="flex justify-center mt-5 flex-col gap-4">
          <div className="bg-secondary rounded-md p-5 items-center flex justify-center">
            <div className="p-10 border-dashed border">
              Drop the file you want to upload
            </div>
          </div>
          <Button variant="outline" className="flex gap-2">
            <Icons.Upload />
            <div> Upload the files</div>
          </Button>
        </div>
      </div>
      <div className="mt-7">
        <Table />
      </div>
    </div>
  );
};

export default page;
