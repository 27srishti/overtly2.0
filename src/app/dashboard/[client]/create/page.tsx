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
import Navbar from "@/components/Customcomponent/Navbar";

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
      <Navbar />
      <div className="container px-0 relative">
        <div className="flex transition  duration-1000 ease-in-out">
          <div
            className={`${
              mini ? "w-16" : "w-32 rounded-r-sm"
            } sm:w-36 z-50 h-[calc(100vh-3rem)] fixed top-12 border-x cursor-pointer flex flex-col gap-3 bg-opacity-20  backdrop-filter backdrop-blur-lg border border-opacity-20  border-y transition  duration-1000 ease-in-out`}
            onMouseOver={toggleSidebar}
            onMouseOut={toggleSidebar}
          >
            <div className="flex items-center py-2 px-4 mt-6 gap-2">
              <div>
                <Icons.Vector />
              </div>
              <span className={`${mini ? "hidden" : ""} sm:block ml-2`}>
                About
              </span>
            </div>
            <div className="flex items-center py-2 px-4 gap-2 gap-2">
              <div>
                <Icons.Vector />
              </div>
              <span className={`${mini ? "hidden" : ""} sm:block ml-2`}>
                Services
              </span>
            </div>
            <div className="flex items-center py-2 px-4 gap-2">
              <div>
                <Icons.Vector />
              </div>
              <span className={`${mini ? "hidden" : ""} sm:block ml-2`}>
                Clients
              </span>
            </div>
            <div className="flex items-center py-2 px-4 gap-2">
              <div>
                <Icons.Vector />
              </div>
              <div className={`${mini ? "hidden" : ""} sm:block ml-2`}>
                Contact
              </div>
            </div>
          </div>
          <div className="w-full px-5 mt-4 ml-16 sm:ml-36 lg:px-10 xl:py-10">
            <div className="w-full mt-4">
              <div className="">
                <div className="text-3xl font-bold mt-4 ml-2">
                  Create a project
                </div>
                <div className="ml-2">Client Name - Apple</div>
                <div>
                  <div className="border p-3 rounded-lg mt-6 flex flex-col gap-6 py-8">
                    <div className="grid w-full max-w-lg items-center gap-1.5">
                      <Label htmlFor="email">Idea hint</Label>
                      <Input type="email" id="email" placeholder="Idea hint" />
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="border bg-secondary p-1 pl-2 rounded-lg flex justify-center items-center gap-2 text-sm">
                          Rachel Meyers <Icons.Cross />
                        </div>
                        <div className="border bg-secondary p-1 pl-2 rounded-lg flex justify-center items-center gap-2 text-sm">
                          Rachel Meyers <Icons.Cross />
                        </div>
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
                      <Button className="items-center">
                        Generate using ai
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 sm:mx-2">
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
    </div>
  );
};

export default Page;
