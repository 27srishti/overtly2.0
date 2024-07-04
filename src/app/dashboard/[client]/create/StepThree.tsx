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
import {
  useClientStore,
  useFormStore,
  useProjectStore,
  IdeasandMailStore,
} from "@/store";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase/firebase";
import { toast } from "@/components/ui/use-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

interface StepTwoProps {
  onPrevious: () => void;
  onNext: () => void;
}

const StepThree: React.FC<StepTwoProps> = ({ onPrevious, onNext }) => {
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const clientid = params.client;
  const searchParams = useSearchParams();
  const projectDocId = searchParams.get("projectid");
  const { project, setproject } = useProjectStore();
  const [fetchedValues, setFetchedValues] = useState<{
    generatedIdeas: { idea: string; story: string }[];
    selectedGeneratedIdea: { idea: string; story: string };
  }>({
    generatedIdeas: [],
    selectedGeneratedIdea: { idea: "", story: "" },
  });

  useEffect(() => {
    const fetchData = async (user: User) => {
      setLoading(true);
      try {
        const docRef = doc(
          db,
          `users/${user.uid}/clients/${clientid}/projects/${projectDocId}`
        );
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const firebasedata = docSnap.data();
          if (
            firebasedata.generatedIdeas &&
            firebasedata.selectedGeneratedIdea
          ) {
            setFetchedValues({
              generatedIdeas: firebasedata.generatedIdeas,
              selectedGeneratedIdea: firebasedata.selectedGeneratedIdea,
            });
          } else {
            try {
              const response = await fetch("/api/ideas", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${await user.getIdToken()}`,
                },
                body: JSON.stringify({
                  client_id: clientid,
                  idea_hint: firebasedata.ideaHint,
                  keywords: firebasedata.Ideas,
                  media_format: firebasedata.mediaFormat,
                  beat: firebasedata.beat,
                  outlet: firebasedata.outlet,
                  objective: firebasedata.objective,
                }),
              });
              const data = await response.json();
              setFetchedValues({
                generatedIdeas: data,
                selectedGeneratedIdea: { idea: "", story: "" },
              });
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData(user);
      }
    });

    return () => unsubscribe();
  }, [clientid, projectDocId]);

  const updateFormData = async (formData: {
    generatedIdeas: { idea: string; story: string }[];
    selectedGeneratedIdea: { idea: string; story: string };
    currentStep: number;
  }) => {
    try {
      const docRef = doc(
        db,
        `users/${auth.currentUser?.uid}/clients/${clientid}/projects/${projectDocId}`
      );
      await updateDoc(docRef, formData);
      console.log("Form data updated successfully in the database");
    } catch (error) {
      console.error("Error updating form data:", error);
    }
  };
  return (
    <div className="w-full mt-4 xl:px-52 font-montserrat flex justify-between flex-col items-center">
      <div>
        <div className="text-2xl  my-7 text-[#545454] font-medium">
          Select an Idea
        </div>
        <ScrollArea className=" rounded-lg mt-6 flex flex-col gap-6 py-8 lg:px-10 px-5 max-h-[50vh] bg-white rounded-2xl w-[50vw]">
          {loading ? (
            <>
              <Skeleton className="h-16 w-full mb-3" />
              <Skeleton className="h-16 w-full mb-3" />
              <Skeleton className="h-16 w-full mb-3" />
              <Skeleton className="h-16 w-full mb-3" />
              <Skeleton className="h-16 w-full mb-3" />
            </>
          ) : (
            <Accordion
              type="single"
              // value={fetchedValues.selectedGeneratedIdea.idea}
              // value={fetchedValues.generatedIdeas.map(
              //   (item) => `item-${item.idea}`
              // )}
            >
              {Array.isArray(fetchedValues?.generatedIdeas) &&
                fetchedValues.generatedIdeas.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${item.idea}`}
                    className={`${
                      fetchedValues.selectedGeneratedIdea.idea ===
                      `${item.idea}`
                        ? "border-[#9FD2FF] border rounded-[2.1rem]"
                        : ""
                    } p-0`}
                  >
                    <AccordionTrigger
                      className={`${
                        fetchedValues.selectedGeneratedIdea.idea ===
                        `${item.idea}`
                          ? "border-[#6EB9FF] border bg-[#FAFCFF] text-opacity-70"
                          : "border-[#B0B0B0] border bg-[#FBFBFB] text-opacity-40"
                      } rounded-full p-4  cursor-pointer text-justify px-7 font-semibold text-black`}
                      onClick={() => {
                        setFetchedValues({
                          ...fetchedValues,
                          selectedGeneratedIdea: item,
                        });
                      }}
                    >
                      {item.idea}
                    </AccordionTrigger>
                    <AccordionContent className="px-7 font-regular">
                      {item.story}
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          )}
        </ScrollArea>
        <div className="mt-4 sm:mx-2">
          <div className="flex items-center justify-between">
            <Button
              className="flex rounded-full px-5 items-center justify-start pr-8 p-5 bg-[#5C5C5C]"
              onClick={onPrevious}
            >
              <ArrowLeftIcon className="mr-3" />
            </Button>
            <Button
              className="items-center rounded-full px-14 bg-[#5C5C5C] py-5"
              onClick={() => {
                if (
                  fetchedValues.selectedGeneratedIdea.idea !== "" &&
                  fetchedValues.selectedGeneratedIdea.story !== ""
                ) {
                  updateFormData({
                    generatedIdeas: fetchedValues.generatedIdeas,
                    selectedGeneratedIdea: fetchedValues.selectedGeneratedIdea,
                    currentStep: 3,
                  });
                  onNext();
                } else {
                  toast({
                    title: "Error",
                    description: "Please select a topic",
                    variant: "destructive",
                  });
                }
              }}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepThree;
