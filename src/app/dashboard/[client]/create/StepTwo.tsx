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
import {
  beats,
  DigitalMedia,
  mediaFormats,
  Objective,
  TraditionalMedia,
} from "@/lib/dropdown";

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
              <Label>Media format</Label>
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
                    <SelectLabel>Media Formats</SelectLabel>
                    {mediaFormats.map((mediaFormat) => (
                      <SelectItem key={mediaFormat} value={mediaFormat}>
                        {mediaFormat}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full xl:w-[40vw] items-center gap-1.5">
              <Label >Beat</Label>
              <Select
                onValueChange={(e) => {
                  updateFormData({
                    beat: e,
                  });
                }}
                value={formData.beat}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Beat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Beat</SelectLabel>
                    {beats.map((beat) => (
                      <SelectItem key={beat} value={beat}>
                        {beat}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full xl:w-[40vw] items-center gap-1.5">
              <Label >Outlet</Label>
              <Select
                onValueChange={(e) => {
                  updateFormData({
                    outlet: e,
                  });
                }}
                value={formData.outlet}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Outlet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Traditional media</SelectLabel>
                    {TraditionalMedia.map((mediaFormat) => (
                      <SelectItem key={mediaFormat} value={mediaFormat}>
                        {mediaFormat}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Digital Media</SelectLabel>
                    {DigitalMedia.map((mediaFormat) => (
                      <SelectItem key={mediaFormat} value={mediaFormat}>
                        {mediaFormat}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full xl:w-[40vw] items-center gap-1.5">
              <Label htmlFor="email">Objective</Label>
              <Select
                onValueChange={(e) => {
                  updateFormData({
                    objective: e,
                  });
                }}
                value={formData.objective}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Objective" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Objective</SelectLabel>
                    {Objective.map((objective) => (
                      <SelectItem key={objective} value={objective}>
                        {objective}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
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
