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
  const [accordionValue, setaccordionValue] = useState([
    {
      idea: "AI-driven personalization for mental health exercises",
      story:
        "Explore how MindEase uses AI to tailor mental health exercises for each user's unique needs, leading to more effective outcomes and improved well-being.",
    },
    {
      idea: "Real-time adjustments based on user feedback",
      story:
        "Discover how MindEase adapts therapy sessions in real-time based on user feedback and mood tracking, providing a personalized and responsive mental health experience.",
    },
    {
      idea: "Privacy-focused approach to mental wellness",
      story:
        "Highlight how MindEase prioritizes user privacy and confidentiality, offering a secure platform for individuals to improve their mental health in a safe and trusted environment.",
    },
    {
      idea: "Targeting tech-savvy individuals aged 18-35",
      story:
        "Showcase how MindEase caters to a young, tech-savvy demographic who values privacy and proactive mental health management, making it the ideal app for the digital generation.",
    },
    {
      idea: "Differentiating from competitors with AI-driven personalization",
      story:
        "Illustrate how MindEase stands out in the crowded mental health app market by offering AI-driven personalization and access to licensed therapists, setting a new standard for digital mental wellness solutions.",
    },
  ]);
  const { formData, updateFormData } = useFormStore();

  return (
    <div className="w-full mt-4 xl:px-52">
      <div className="">
        <div className="text-3xl font-bold mt-4 ml-2">Pitch options</div>
        <div className="ml-2">Client Name - Apple</div>
        <div>
          <ScrollArea className="border rounded-lg mt-6 flex flex-col gap-6 py-8 lg:px-10 px-5 max-h-[50vh]">
            <Accordion type="multiple">
              {accordionValue.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}
                className="shadow-md border">
                  <AccordionTrigger className="ml-4">{item.idea}</AccordionTrigger>
                  <AccordionContent
                    onClick={() => setSelectedItem(`item-${index}`)}
                    className={`${
                      selectedItem === `item-${index}` ? "bg-secondary" : ""
                    }`}
                  >
                    {item.story}
                  </AccordionContent>
                </AccordionItem>
              ))}
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
