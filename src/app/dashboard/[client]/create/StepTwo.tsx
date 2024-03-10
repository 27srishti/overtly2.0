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
import { useFormStore } from "@/store";

interface StepTwoProps {
  onPrevious: () => void;
  onNext: () => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ onPrevious, onNext }) => {
  const { formData, updateFormData } = useFormStore();
  console.log(formData);
  return (
    <div className="w-full mt-4 xl:px-52">
      <div className="">
        <div className="text-3xl font-bold mt-4 ml-2">Pitch options</div>
        <div className="ml-2">Client Name - Apple</div>
        <div>
          <div className="border p-3 rounded-lg mt-6 flex flex-col gap-6 py-8 lg:pl-10 items-center">
            <div className="grid w-full xl:w-[40vw] items-center gap-1.5">
              <Label htmlFor="email">Media format</Label>
              <Select
                onValueChange={(e) => {
                  updateFormData({
                    mediaFormat: e,
                  });
                }}
                value={formData.mediaFormat}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Media Details" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Media Details</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full xl:w-[40vw] items-center gap-1.5">
              <Label>Beat</Label>
              <Input
                onChange={(e) => {
                  updateFormData({
                    beat: e.target.value,
                  });
                }}
                value={formData.beat}
                placeholder="Beat"
              />
            </div>
            <div className="grid w-full xl:w-[40vw] items-center gap-1.5">
              <Label>Outlet</Label>
              <Input
                placeholder="Outlet"
                onChange={(e) => {
                  updateFormData({
                    outlet: e.target.value,
                  });
                }}
                value={formData.outlet}
              />
            </div>
            <div className="grid w-full xl:w-[40vw] items-center gap-1.5">
              <Label>Objective</Label>
              <Input
                placeholder="Objective"
                onChange={(e) => {
                  updateFormData({
                    objective: e.target.value,
                  });
                }}
                value={formData.objective}
              />
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
