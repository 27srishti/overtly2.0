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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";

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
const StepThree: React.FC<StepTwoProps> = ({
  onPrevious,
  onNext,
  formData,
  setFormData,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelectedItem(value);
    console.log(value);
  };

  return (
    <div className="w-full mt-4">
      <div className="">
        <div className="text-3xl font-bold mt-4 ml-2">Pitch options</div>
        <div className="ml-2">Client Name - Apple</div>
        <div>
          <div className="border p-3 rounded-lg mt-6 flex flex-col gap-6 py-8 lg:pl-10">
          <Accordion type="single">
      <AccordionItem value="item-1" onSelect={handleSelect}>
        <AccordionTrigger>Accordion Item 1</AccordionTrigger>
        <AccordionContent>Content for Accordion Item 1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" onSelect={handleSelect}>
        <AccordionTrigger>Accordion Item 2</AccordionTrigger>
        <AccordionContent>Content for Accordion Item 2</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3" onSelect={handleSelect}>
        <AccordionTrigger>Accordion Item 3</AccordionTrigger>
        <AccordionContent>Content for Accordion Item 3</AccordionContent>
      </AccordionItem>
    </Accordion>
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

export default StepThree;
