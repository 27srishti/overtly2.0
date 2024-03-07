"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/ui/Icons";

interface StepOneProps {
  onNext: () => void;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      firstName: string;
      lastName: string;
      email: string;
    }>
  >;
}

const StepOne: React.FC<StepOneProps> = ({ onNext, formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className="w-full mt-4">
      <div className="">
        <div className="text-3xl font-bold mt-4 ml-2">Create a project</div>
        <div className="ml-2">Client Name - Apple</div>
        <div>
          <div className="border p-3 rounded-lg mt-6 flex flex-col gap-6 py-8 lg:pl-10">
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="email">Idea hint</Label>
              <Input type="email" id="email" placeholder="Idea hint" />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="border bg-secondary p-1 pl-2 rounded-lg flex justify-center items-center gap-2 text-sm">
                  Rachel Meyers <Icons.Cross />
                </div>
                <div className="border bg-secondary p-1 pl-2 rounded-lg flex justify-center items-center gap-2 text-sm">
                  Rachel Meyers <Icons.Cross />
                </div>
                <div className="border bg-secondary p-1 pl-2 rounded-lg flex justify-center items-center gap-2 text-sm">
                  Rachel Meyers <Icons.Cross />
                </div>
                <div className="border bg-secondary p-1 pl-2 rounded-lg flex justify-center items-center gap-2 text-sm">
                  Rachel Meyers <Icons.Cross />
                </div>
              </div>
              <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="email">Keywords</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Use comma to seprate values"
                />
              </div>
            </div>
            <div className="flex justify-center items-center">or</div>
            <div className="flex justify-center items-center">
              <Button className="items-center">Generate using ai</Button>
            </div>
          </div>
          <div className="mt-4 sm:mx-2">
            <div className="flex items-center justify-between">
              <Button className="items-center" disabled>
                Previous
              </Button>
              <Button className="items-center" onClick={onNext}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepOne;
