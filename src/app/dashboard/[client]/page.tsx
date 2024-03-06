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
            <div className="text-3xl font-bold mt-4 ml-2">Apple</div>
            {/* <Dialog>
              <DialogTrigger asChild> */}
            <Link href={`${pathname}/create`}>
              <Button variant={"outline"} className="mt-5">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
                    fill="currentColor"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <div className="ml-1">Create a Client</div>
              </Button>
            </Link>

            {/* </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when done.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-3"
                  >
                    <FormField
                      control={form.control}
                      name="Name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Raj" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="Company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Apple" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="Service"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="ml-full">
                      Submit
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog> */}
            <div className="grid grid-cols-3 mt-5 gap-3">
              <div className="border rounded-sm p-4 flex gap-2 flex-col">
                <div className="flex  gap-2 items-center">
                  <Icons.Person /> <div>Project name</div>
                </div>
                <div>
                  The ultimate app for your Apple Watch. Enhance your experience
                  with custom watch faces, health tracking, and more.
                </div>
              </div>
              <div className="border rounded-sm p-4 flex gap-2 flex-col">
                <div className="flex  gap-2 items-center">
                  <Icons.Person /> <div>Project name</div>
                </div>
                <div>
                  The ultimate app for your Apple Watch. Enhance your experience
                  with custom watch faces, health tracking, and more.
                </div>
              </div>
              <div className="border rounded-sm p-4 flex gap-2 flex-col">
                <div className="flex  gap-2 items-center">
                  <Icons.Person /> <div>Project name</div>
                </div>
                <div>
                  The ultimate app for your Apple Watch. Enhance your experience
                  with custom watch faces, health tracking, and more.
                </div>
              </div>
              <div className="border rounded-sm p-4 flex gap-2 flex-col">
                <div className="flex  gap-2 items-center">
                  <Icons.Person /> <div>Project name</div>
                </div>
                <div>
                  The ultimate app for your Apple Watch. Enhance your experience
                  with custom watch faces, health tracking, and more.
                </div>
              </div>
              <div className="border rounded-sm p-4 flex gap-2 flex-col">
                <div className="flex  gap-2 items-center">
                  <Icons.Person /> <div>Project name</div>
                </div>
                <div>
                  The ultimate app for your Apple Watch. Enhance your experience
                  with custom watch faces, health tracking, and more.
                </div>
              </div>
              <div className="border rounded-sm p-4 flex gap-2 flex-col">
                <div className="flex  gap-2 items-center">
                  <Icons.Person /> <div>Project name</div>
                </div>
                <div>
                  The ultimate app for your Apple Watch. Enhance your experience
                  with custom watch faces, health tracking, and more.
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
