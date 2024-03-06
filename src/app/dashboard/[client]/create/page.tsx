"use client";

import { Icons } from "@/components/ui/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@radix-ui/react-select";

const Page = () => {
  const [mini, setMini] = useState(true);
  const pathname = usePathname();
  const toggleSidebar = () => {
    setMini((prevState) => !prevState);
  };
  const formSchema = z.object({
    Name: z
      .string()
      .min(1, {
        message: "Classname must be at least 1 characters.",
      })
      .max(15, {
        message: "Classname must be at most 15 characters.",
      }),
    Company: z
      .string()
      .min(1, {
        message: "Section must be at least 1 characters.",
      })
      .max(15, {
        message: "Section must be at most 15 characters.",
      }),
    Service: z
      .string()
      .min(1, {
        message: "Subject must be at least 1 characters.",
      })
      .max(15, {
        message: "Subject must be at most 15 characters.",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <div>
      <div className="sticky top-0 z-50">
        <div className="border-b">
          <div className="container flex justify-between px-2 items-center">
            <div className="flex items-center justify-center text-lg">
              <img src="/images.png" className="w-12" alt="Logo" />
              <div className="ml-2">Public relation</div>
            </div>
            <div className="flex items-center">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-0 ">
        <div className="flex">
          <div
            className={`${
              mini ? "w-16" : "w-30"
            }  transition-all duration-900 z-50 h-[calc(100vh-3.1rem)] sticky top-12 border-x right-20 cursor-pointer ease-in-out flex flex-col gap-3`}
            onMouseOver={toggleSidebar}
            onMouseOut={toggleSidebar}
          >
            <div className="flex items-center py-2 px-4 mt-6 gap-2">
              <div>
                <Icons.Vector />
              </div>
              <span className={`${mini ? "hidden" : "ml-2"} `}>About</span>
            </div>
            <div className="flex items-center py-2 px-4 gap-2 gap-2">
              <div>
                <Icons.Vector />
              </div>
              <span className={`${mini ? "hidden" : "ml-2"}`}>Services</span>
            </div>
            <div className="flex items-center py-2 px-4 gap-2">
              <div>
                <Icons.Vector />
              </div>
              <span className={`${mini ? "hidden" : "ml-2"}`}>Clients</span>
            </div>
            <div className="flex items-center py-2 px-4 gap-2">
              <div>
                <Icons.Vector />
              </div>
              <div className={`${mini ? "hidden" : "ml-2"}`}>Contact</div>
            </div>
          </div>
          <div className="w-full px-5 mt-4">
            <div className="p-20">
              <div className="text-3xl font-bold mt-4 ml-2">
                Create a project
              </div>
              <div className="ml-2">Client Name - Apple</div>
              <div>
                <div className="border p-3 rounded-lg mt-6 pl-10 flex flex-col gap-6 py-8">
                  <div className="grid w-full max-w-lg items-center gap-1.5">
                    <Label htmlFor="email">Idea hint</Label>
                    <Input type="email" id="email" placeholder="Idea hint" />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="border bg-secondary p-1 pl-2 rounded-lg flex justify-center items-center gap-2 text-sm">
                        Rachel Meyers <Icons.Cross />
                      </div>
                      <div className="border bg-secondary p-1 pl-2 rounded-lg flex justify-center items-center gap-2 text-sm">
                        Rachel Meyers <Icons.Cross />
                      </div>
                    </div>
                    <div className="grid w-full max-w-lg items-center gap-1.5">
                      <Label htmlFor="email">Keywords</Label>
                      <Input
                        type="email"
                        id="email"
                        placeholder="Use comma to seprate values"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center items-center">or</div>
                  <div className="flex justify-center items-center">
                    <Button className="items-center">Generate using ai</Button>
                  </div>
                </div>
               <div className="mt-4 mx-3">
               <div className="flex items-center justify-between">
                  <Button className="items-center">Previous</Button>
                  <Button className="items-center">Next</Button>
                </div>
               </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
