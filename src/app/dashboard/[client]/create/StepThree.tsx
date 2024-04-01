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
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase/firebase";
import { toast } from "@/components/ui/use-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";

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
    const fetchData = async () => {
      setLoading(true);
      try {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (user) {
            const docRef = doc(
              db,
              `users/${user.uid}/clients/${clientid}/projects/${projectDocId}`
            );
            const docSnap = await getDoc(docRef);
            console.log(docSnap.exists());
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
                const response = await fetch(
                  "https://pr-ai-99.uc.r.appspot.com/ideas",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      user_id: user.uid,
                      client_id: clientid,
                      idea_hint: firebasedata.ideaHint,
                      keywords: firebasedata.Ideas,
                      generatebyai: firebasedata.generatebyai,
                      media_format: firebasedata.mediaFormat,
                      beat: firebasedata.beat,
                      outlet: firebasedata.outlet,
                      objective: firebasedata.objective,
                    }),
                  }
                );
                const data = await response.json();
                console.log(data);
                setFetchedValues({
                  generatedIdeas: data,
                  selectedGeneratedIdea: { idea: "", story: "" },
                });
              }
            }
            setLoading(false);
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
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
              <Accordion
                type="multiple"
                value={fetchedValues.generatedIdeas.map(
                  (item) => `item-${item.idea}`
                )}
              >
                {fetchedValues.generatedIdeas.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${item.idea}`}
                    className="shadow-md border"
                  >
                    <AccordionTrigger className="ml-4">
                      {item.idea}
                    </AccordionTrigger>
                    <AccordionContent
                      onClick={() => {
                        setFetchedValues({
                          ...fetchedValues,
                          selectedGeneratedIdea: item,
                        });
                      }}
                      className={`${
                        fetchedValues.selectedGeneratedIdea.idea ===
                        `${item.idea}`
                          ? "bg-secondary"
                          : ""
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
              <Button
                className="items-center"
                onClick={() => {
                  if (
                    fetchedValues.selectedGeneratedIdea.idea !== "" &&
                    fetchedValues.selectedGeneratedIdea.story !== ""
                  ) {
                    updateFormData({
                      generatedIdeas: fetchedValues.generatedIdeas,
                      selectedGeneratedIdea:
                        fetchedValues.selectedGeneratedIdea,
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
    </div>
  );
};

export default StepThree;
