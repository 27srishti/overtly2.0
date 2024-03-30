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
import { useFormStore, useProjectStore } from "@/store";
import {
  beats,
  DigitalMedia,
  mediaFormats,
  Objective,
  TraditionalMedia,
} from "@/lib/dropdown";
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
import { useForm } from "react-hook-form";

interface StepTwoProps {
  onPrevious: () => void;
  onNext: () => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ onPrevious, onNext }) => {
  const { formData, updateFormData } = useFormStore();
  console.log(formData);

  const { project, setproject } = useProjectStore();

  const formSchema = z.object({
    mediaFormat: z.string().min(1, {
      message: "Please select Demographics.",
    }),
    beat: z.string().min(1, {
      message: "Please select Demographics.",
    }),
    outlet: z.string().min(1, {
      message: "Please select Demographics.",
    }),
    objective: z.string().min(1, {
      message: "Please select Demographics.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mediaFormat: formData.mediaFormat,
      beat: formData.beat,
      outlet: formData.outlet,
      objective: formData.objective,
    },
  });

  return (
    <div className="w-full mt-4 xl:px-52">
      <div className="">
        <div className="text-3xl font-bold mt-4 ml-2">Pitch options</div>
        <div className="ml-2">Description : {project?.description}</div>
        <div>
          <div className="border p-3 rounded-lg mt-6 flex flex-col gap-6 py-8 lg:pl-10 items-center">
            <div className="grid w-full xl:w-[40vw] items-center gap-1.5">
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
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Media Details" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Media Formats</SelectLabel>
                                {mediaFormats.map((mediaFormat) => (
                                  <SelectItem
                                    key={mediaFormat}
                                    value={mediaFormat}
                                  >
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
                    name="beat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Beat</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full">
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
                  />
                  <FormField
                    control={form.control}
                    name="outlet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Outlet</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a Outlet" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Traditional media</SelectLabel>
                                {TraditionalMedia.map((mediaFormat) => (
                                  <SelectItem
                                    key={mediaFormat}
                                    value={mediaFormat}
                                  >
                                    {mediaFormat}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                              <SelectGroup>
                                <SelectLabel>Digital Media</SelectLabel>
                                {DigitalMedia.map((mediaFormat) => (
                                  <SelectItem
                                    key={mediaFormat}
                                    value={mediaFormat}
                                  >
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
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full">
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
            </div>
          </div>
          <div className="mt-4 sm:mx-2">
            <div className="flex items-center justify-between">
              <Button className="items-center" onClick={onPrevious}>
                Previous
              </Button>
              <Button
                className="items-center"
                onClick={async () => {
                  const isValid = await form.trigger();

                  if (isValid) {
                    updateFormData(form.getValues());
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
