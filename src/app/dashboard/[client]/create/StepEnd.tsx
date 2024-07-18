"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeftIcon } from "lucide-react";

const StepEnd: React.FC<{ onPrevious: () => void }> = ({ onPrevious }) => {
  return (
    <div className="w-full mt-4 xl:px-52 font-montserrat">
      <div className="p-3 rounded-lg mt-6 flex flex-col gap-6 py-8 lg:pl-10 items-center w-full">
        <div className="flex w-full items-center gap-3   text-[#545454] font-medium  justify-between text-xl">
          <div className="">
            <div>Media Data</div>
          </div>
          <div className="flex gap-4">
            <div className="text-[#545454] bg-[#EAEAE8] p-2 rounded-[30px] px-3 text-sm">
              Ai Recomendede
            </div>

            <div className="text-[#545454] bg-[#EAEAE8] p-2 rounded-[30px] px-3 text-sm">
              <Dialog>
                <DialogTrigger>Add</DialogTrigger>
                <DialogContent className="sm:max-w-[425px] font-montserrat text-[#545454] min-w-[35vw] min-h-[28vw] p-10 px-12 pb-8">
                  <DialogHeader>
                    <div className="text-xl mt-3 ml-1 font-medium">
                      Add new Client
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <div className="border border-[#EAEAE8] w-full rounded-[30px] items-center flex justify-center min-h-[300px]">
          Table
        </div>
        <div className="w-full">
          <div className="mt-4 sm:mx-2">
            <div className="flex items-center justify-between">
              <Button className="flex rounded-full px-5 items-center justify-start pr-8 p-5 bg-[#5C5C5C]">
                <ArrowLeftIcon className="mr-3" />
              </Button>
              <Button className="items-center rounded-full px-14 bg-[#5C5C5C] py-5">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepEnd;
