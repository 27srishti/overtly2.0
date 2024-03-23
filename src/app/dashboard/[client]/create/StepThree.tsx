"use client";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFormStore, useProjectStore } from "@/store";
import { Skeleton } from "@/components/ui/skeleton";

interface Idea {
  idea: string;
  story: string;
}

interface StepTwoProps {
  onPrevious: () => void;
  onNext: () => void;
}

const StepThree: React.FC<StepTwoProps> = ({ onPrevious, onNext }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [accordionValue, setAccordionValue] = useState<Idea[]>([]);
  const { formData, updateFormData } = useFormStore();
  const [loading, setLoading] = useState(false);
  const { project, setproject } = useProjectStore();

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://pr-ai-99.uc.r.appspot.com/ideas",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch ideas");
        }
        const data = await response.json();
        console.log("Ideas:", data);
        setAccordionValue(data);
      } catch (error) {
        console.error("Error fetching ideas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, [formData]);

  return (
    <div className="w-full mt-4 xl:px-52">
      <div className="">
        <div className="text-3xl font-bold mt-4 ml-2">Pitch options</div>
        <div className="ml-2">Description : {project?.description}</div>
        <div>
          <ScrollArea className="border rounded-lg mt-6 flex flex-col gap-6 py-8 lg:px-10 px-5 max-h-[50vh]">
            {loading ? (
              <>
                <Skeleton className="h-16 w-full mb-3" />
                <Skeleton className="h-16 w-full mb-3" />
                <Skeleton className="h-16 w-full mb-3" />
                <Skeleton className="h-16 w-full mb-3" />
                <Skeleton className="h-16 w-full mb-3" />
              </>
            ) : (
              <Accordion type="multiple">
                {accordionValue.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="shadow-md border"
                  >
                    <AccordionTrigger className="ml-4">
                      {item.idea}
                    </AccordionTrigger>
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
            )}
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
