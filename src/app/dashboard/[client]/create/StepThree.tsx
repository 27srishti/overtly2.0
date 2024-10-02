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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Textarea } from "@/components/ui/normaltextarea";

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

  const formSchema = z.object({
    contextText: z
      .string()
      .min(1, {
        message: "Context Text be at least 1 characters.",
      })
      .max(5000, {
        message: "Context Text be at most 5000 characters.",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contextText: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

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
        <div className="flex items-center justify-between">
          <div className="text-2xl  my-7 text-[#545454] font-medium">
            Select an Idea
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 border rounded-[45px] border-[#717171] border-opacity-15 bg-[#FEFEFE]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 15 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 0.5C6.0157 0.5 4.65141 1.04172 3.60352 1.9375C3.55099 1.97931 3.50742 2.03128 3.47541 2.09029C3.4434 2.1493 3.4236 2.21416 3.41719 2.28099C3.41079 2.34782 3.4179 2.41525 3.43811 2.47927C3.45833 2.54329 3.49122 2.60259 3.53485 2.65362C3.57847 2.70466 3.63192 2.74638 3.69201 2.77632C3.75211 2.80625 3.81761 2.82378 3.88463 2.82785C3.95164 2.83192 4.01878 2.82246 4.08206 2.80002C4.14534 2.77759 4.20345 2.74264 4.25293 2.69727C5.12704 1.95005 6.2583 1.5 7.5 1.5C10.0983 1.5 12.2255 3.46896 12.4756 6H11L13 9L15 6H13.4746C13.219 2.92583 10.6389 0.5 7.5 0.5ZM2 4L0 7H1.52539C1.78104 10.0742 4.36108 12.5 7.5 12.5C8.9843 12.5 10.3486 11.9583 11.3965 11.0625C11.449 11.0207 11.4926 10.9687 11.5246 10.9097C11.5566 10.8507 11.5764 10.7858 11.5828 10.719C11.5892 10.6522 11.5821 10.5847 11.5619 10.5207C11.5417 10.4567 11.5088 10.3974 11.4652 10.3464C11.4215 10.2953 11.3681 10.2536 11.308 10.2237C11.2479 10.1937 11.1824 10.1762 11.1154 10.1722C11.0484 10.1681 10.9812 10.1775 10.9179 10.2C10.8547 10.2224 10.7966 10.2574 10.7471 10.3027C9.87296 11.05 8.7417 11.5 7.5 11.5C4.90172 11.5 2.77451 9.53104 2.52441 7H4L2 4Z"
                  fill="#717171"
                />
              </svg>
            </div>

            <Dialog>
              <DialogTrigger>
                <div className="flex items-center gap-2 p-3 border rounded-[45px] border-[#717171] border-opacity-15 bg-[#FEFEFE]">
                  <img src="/hicking.png" alt="" />
                  <div className="text-[#7C7C7C] text-[12px]">
                    Guide Generation
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] font-montserrat text-[#545454] min-w-[40vw] min-h-[25vw] p-10 px-12 flex flex-col justify-around">
                <DialogHeader>
                  <DialogTitle className="text-xl mt-3 ml-1  font-medium">
                    Guide Idea Generation
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="">
                    <FormField
                      control={form.control}
                      name="contextText"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Ex: Give me ideas regarding .... With ... perspective"
                              {...field}
                              className="w-full grey shadow-none outline-none border-0 rounded-lg  h-11 w-full h-[25vh] resize-none"
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="rounded-full bg-[#545454] p-5 text-white font-montserrat px-11 mr-1"
                  >
                    Regenerate
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <ScrollArea className=" rounded-lg mt-6 flex flex-col gap-6 py-8 lg:px-10 px-5 max-h-[50vh] bg-white rounded-2xl w-[50vw]">
          {loading ? (
            <div>
              <Skeleton className="h-16 w-full mb-3" />
              <Skeleton className="h-16 w-full mb-3" />
              <Skeleton className="h-16 w-full mb-3" />
              <Skeleton className="h-16 w-full mb-3" />
              <Skeleton className="h-16 w-full mb-3" />
            </div>
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
