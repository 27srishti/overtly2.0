"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StepTwoProps {
  onPrevious: () => void;
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
const StepTwo: React.FC<StepTwoProps> = ({
  onPrevious,
  onNext,
  formData,
  setFormData,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full mt-4 xl:px-52">
      <div className="">
        <div className="text-3xl font-bold mt-4 ml-2">Pitch options</div>
        <div className="ml-2">Client Name - Apple</div>
        <div>
          <div className="border p-3 rounded-lg mt-6 flex flex-col gap-6 py-8 lg:pl-10">
            <div className="grid lg:md-full lg:md:max-w-[50%]  items-center gap-1.5">
              <Label htmlFor="email">Media format</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid lg:md-full lg:md:max-w-[50%] items-center gap-1.5">
              <Label htmlFor="email">Beat</Label>
              <Input type="email" id="email" placeholder="Idea hint" />
            </div>
            <div className="grid lg:md-full lg:md:max-w-[50%] items-center gap-1.5">
              <Label htmlFor="email">Outlet</Label>
              <Input type="email" id="email" placeholder="Idea hint" />
            </div>
            <div className="grid lg:md-full lg:md:max-w-[50%] items-center gap-1.5">
              <Label htmlFor="email">Objective</Label>
              <Input type="email" id="email" placeholder="Idea hint" />
            </div>
          </div>
          <div className="mt-4 sm:mx-2">
            <div className="flex items-center justify-between">
              <Button className="items-center" onClick={onPrevious}>
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

export default StepTwo;
