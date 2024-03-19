"use client";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFormStore } from "@/store";

interface StepTwoProps {
  onPrevious: () => void;
  onNext: () => void;
}
const StepThree: React.FC<StepTwoProps> = ({ onPrevious, onNext }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const { formData, updateFormData } = useFormStore();
  const handleSelect = (value: string) => {
    setSelectedItem(value);
    console.log(value);
  };
  console.log(formData);
  return (
    <div className="w-full mt-4 xl:px-52">
      <div className="">
        <div className="text-3xl font-bold mt-4 ml-2">Pitch options</div>
        <div className="ml-2">Client Name - Apple</div>
        <div>
          <ScrollArea className="border rounded-lg mt-6 flex flex-col gap-6 py-8 lg:px-10 px-5 max-h-[50vh]">
            <Accordion type="multiple">
              <AccordionItem value="item-1" onSelect={handleSelect}>
                <AccordionTrigger>Accordion Item 1</AccordionTrigger>
                <AccordionContent
                  onClick={() => setSelectedItem("use client")}
                  className={
                    selectedItem === "item-1"
                      ? "bg-primary text-background"
                      : ""
                  }
                >
                  Content for Accordion Item 1
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" onSelect={handleSelect}>
                <AccordionTrigger>Accordion Item 5</AccordionTrigger>
                <AccordionContent
                  onClick={() => setSelectedItem("use client")}
                  className={
                    selectedItem === "item-2"
                      ? "bg-primary text-background"
                      : ""
                  }
                >
                  Content for Accordion Item 2
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" onSelect={handleSelect}>
                <AccordionTrigger>Accordion Item 2</AccordionTrigger>
                <AccordionContent
                  onClick={() => setSelectedItem("use client")}
                  className={
                    selectedItem === "item-5"
                      ? "bg-primary text-background"
                      : ""
                  }
                >
                  Content for Accordion Item 2
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" onSelect={handleSelect}>
                <AccordionTrigger>Accordion Item 3</AccordionTrigger>
                <AccordionContent
                  onClick={() => setSelectedItem("use client")}
                  className={
                    selectedItem === "item-3"
                      ? "bg-primary text-background"
                      : ""
                  }
                >
                  Content for Accordion Item 3
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ScrollArea>
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
