"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebase";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  beats,
  DigitalMedia,
  mediaFormats,
  Objective,
  TraditionalMedia,
} from "@/lib/dropdown";
import { useForm } from "react-hook-form";
import { useProjectStore } from "@/store";
import { ArrowLeftIcon } from "lucide-react";

interface StepTwoProps {
  onPrevious: () => void;
  onNext: () => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ onPrevious, onNext }) => {
  const params = useParams();
  const clientid = params.client;
  const searchParams = useSearchParams();
  const projectDocId = searchParams.get("projectid");
  const { project, setproject } = useProjectStore();

  const formSchema = z.object({
    mediaFormat: z.string().min(1, {
      message: "Please select Media Formats.",
    }),
    beat: z.string().min(1, {
      message: "Please select Beat.",
    }),
    outlet: z.string().min(1, {
      message: "Please select Outlet.",
    }),
    objective: z.string().min(1, {
      message: "Please select Objective.",
    }),
  });

  const [fetchedValues, setFetchedValues] = useState<{
    mediaFormat: string;
    beat: string;
    outlet: string;
    objective: string;
  }>({
    mediaFormat: "",
    beat: "",
    outlet: "",
    objective: "",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          const docRef = doc(
            db,
            `users/${user.uid}/clients/${clientid}/projects/${projectDocId}`
          );
          const docSnap = await getDoc(docRef);
          console.log(docSnap.exists());
          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log(data);

            setFetchedValues({
              mediaFormat: data.mediaFormat,
              beat: data.beat,
              outlet: data.outlet,
              objective: data.objective,
            });

            // Set form values here
            form.setValue("mediaFormat", data.mediaFormat);
            form.setValue("beat", data.beat);
            form.setValue("outlet", data.outlet);
            form.setValue("objective", data.objective);
          }
        }
      });

      return () => unsubscribe();
    };

    fetchData();
  }, [clientid, projectDocId]);

  const updateFormData = async (formData: {
    mediaFormat: string;
    beat: string;
    outlet: string;
    objective: string;
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
  console.log("fetchedValues:", fetchedValues);
  console.log("defaultValues:", form.getValues());
  return (
    <div className="w-full mt-4 xl:px-52 font-montserrat">
      <div className="p-3 rounded-lg mt-6 flex flex-col gap-6 py-8 lg:pl-10 items-center">
        <div className="grid w-full xl:w-[40vw] items-center gap-2">
          <div className="text-2xl  my-7 text-[#545454] font-medium">
            Pitch options
          </div>
          <Form {...form}>
            <form className="space-y-3">
              <FormField
                control={form.control}
                name="mediaFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Media Formats</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("mediaFormat", value);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full grey shadow-none outline-none border-0 rounded-xl  h-11">
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="beat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beat</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("beat", value);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full grey shadow-none outline-none border-0 rounded-xl  h-11">
                          <SelectValue placeholder="Select a Beat" />
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="outlet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outlet</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("outlet", value);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full grey shadow-none outline-none border-0 rounded-xl  h-11">
                          <SelectValue placeholder="Select a Outlet" />
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="objective"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objective </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("objective", value);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full grey shadow-none outline-none border-0 rounded-xl  h-11">
                          <SelectValue placeholder="Select a Objective" />
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <div className="mt-8 sm:mx-2">
            <div className="flex items-center justify-between">
              <Button
                className="flex rounded-full px-5 items-center justify-start pr-8 p-5 bg-[#5C5C5C]"
                onClick={onPrevious}
              >
                <ArrowLeftIcon className="mr-3" />
              </Button>
              <Button
                className="items-center rounded-full px-14 bg-[#5C5C5C] py-5"
                onClick={async () => {
                  const isValid = await form.trigger();

                  if (isValid) {
                    updateFormData({
                      ...form.getValues(),
                      currentStep: 2,
                    });
                    onNext();
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

export default StepTwo;
