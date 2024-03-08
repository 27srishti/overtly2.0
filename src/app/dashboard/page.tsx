"use client";

import { Icons } from "@/components/ui/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import Navbar from "@/components/Customcomponent/Navbar";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebase";
import { client } from "@/lib/firebase/types";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Classname must be at least 1 characters.",
    })
    .max(15, {
      message: "Classname must be at most 15 characters.",
    }),
  industry: z
    .string()
    .min(1, {
      message: "Section must be at least 1 characters.",
    })
    .max(15, {
      message: "Section must be at most 15 characters.",
    }),
  domain: z
    .string()
    .min(1, {
      message: "Subject must be at least 1 characters.",
    })
    .max(15, {
      message: "Subject must be at most 15 characters.",
    }),
  demographics: z
    .string()
    .min(1, {
      message: "Subject must be at least 1 characters.",
    })
    .max(15, {
      message: "Subject must be at most 15 characters.",
    }),
});

const Page = () => {
  const [clients, setClients] = useState<client[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      industry: "",
      domain: "",
      demographics: "",
    },
  });

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
  //     if (authUser) {
  //       try {
  //         const querySnapshot = await getDocs(
  //           query(
  //             collection(db, `users/${authUser.uid}/clients`),
  //             orderBy("createdAt", "desc")
  //           )
  //         );
  //         const clientData = querySnapshot.docs.map((doc) => doc.data());
  //         setClients(clientData);
  //       } catch (error) {
  //         console.error("Error fetching clients: ", error);
  //       }
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const clientData: client = {
      name: values.name,
      industry: values.industry,
      domain: values.domain,
      demographics: values.demographics,
      createdAt: Date.now(),
    };

    await addDoc(
      collection(db, `users/${auth.currentUser?.uid}/clients`),
      clientData
    ).then(() => {
      toast({
        title: "Create Client",
        description: `Client create with name ${values.name}!`,
      });
      form.setValue("name", "");
      form.setValue("industry", "");
      form.setValue("domain", "");
      form.setValue("demographics", "");
    });
  }
  return (
    <div>
      <Navbar />
      <div className="container px-5">
        <div className="text-3xl font-bold mt-4 ml-2">Dashboard</div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"outline"} className="mt-3">
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
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
              <div className="ml-1">Create a Client</div>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create a Client</DialogTitle>
              <DialogDescription>
                Create a client. Click save when done.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Amazon" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Ecommerce" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Grociery" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="demographics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Demographics</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: India" {...field} />
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
        </Dialog>
        <div className="grid grid-cols-1 mt-5 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4">
          <div className="border rounded-sm p-4 flex gap-2 flex-col">
            <div className="flex  gap-2 items-center">
              <Icons.Person /> <div>Client name</div>
            </div>
            <div>
              The ultimate app for your Apple Watch. Enhance your experience
              with custom watch faces, health tracking, and more.
            </div>
          </div>
          <div className="border rounded-sm p-4 flex gap-2 flex-col">
            <div className="flex  gap-2 items-center">
              <Icons.Person /> <div>Client name</div>
            </div>
            <div>
              The ultimate app for your Apple Watch. Enhance your experience
              with custom watch faces, health tracking, and more.
            </div>
          </div>
          <div className="border rounded-sm p-4 flex gap-2 flex-col">
            <div className="flex  gap-2 items-center">
              <Icons.Person /> <div>Client name</div>
            </div>
            <div>
              The ultimate app for your Apple Watch. Enhance your experience
              with custom watch faces, health tracking, and more.
            </div>
          </div>{" "}
          <div className="border rounded-sm p-4 flex gap-2 flex-col">
            <div className="flex  gap-2 items-center">
              <Icons.Person /> <div>Client name</div>
            </div>
            <div>
              The ultimate app for your Apple Watch. Enhance your experience
              with custom watch faces, health tracking, and more.
            </div>
          </div>
          <div className="border rounded-sm p-4 flex gap-2 flex-col">
            <div className="flex  gap-2 items-center">
              <Icons.Person /> <div>Client name</div>
            </div>
            <div>
              The ultimate app for your Apple Watch. Enhance your experience
              with custom watch faces, health tracking, and more.
            </div>
          </div>
          <div className="border rounded-sm p-4 flex gap-2 flex-col">
            <div className="flex  gap-2 items-center">
              <Icons.Person /> <div>Client name</div>
            </div>
            <div>
              The ultimate app for your Apple Watch. Enhance your experience
              with custom watch faces, health tracking, and more.
            </div>
          </div>
          <div className="border rounded-sm p-4 flex gap-2 flex-col">
            <div className="flex  gap-2 items-center">
              <Icons.Person /> <div>Client name</div>
            </div>
            <div>
              The ultimate app for your Apple Watch. Enhance your experience
              with custom watch faces, health tracking, and more.
            </div>
          </div>
          <div className="border rounded-sm p-4 flex gap-2 flex-col">
            <div className="flex  gap-2 items-center">
              <Icons.Person /> <div>Client name</div>
            </div>
            <div>
              The ultimate app for your Apple Watch. Enhance your experience
              with custom watch faces, health tracking, and more.
            </div>
          </div>
          <div className="border rounded-sm p-4 flex gap-2 flex-col">
            <div className="flex  gap-2 items-center">
              <Icons.Person /> <div>Client name</div>
            </div>
            <div>
              The ultimate app for your Apple Watch. Enhance your experience
              with custom watch faces, health tracking, and more.
            </div>
          </div>
          <div className="border rounded-sm p-4 flex gap-2 flex-col">
            <div className="flex  gap-2 items-center">
              <Icons.Person /> <div>Client name</div>
            </div>
            <div>
              The ultimate app for your Apple Watch. Enhance your experience
              with custom watch faces, health tracking, and more.
            </div>
          </div>
          <div className="border rounded-sm p-4 flex gap-2 flex-col">
            <div className="flex  gap-2 items-center">
              <Icons.Person /> <div>Client name</div>
            </div>
            <div>
              The ultimate app for your Apple Watch. Enhance your experience
              with custom watch faces, health tracking, and more.
            </div>
          </div>
          <div className="border rounded-sm p-4 flex gap-2 flex-col">
            <div className="flex  gap-2 items-center">
              <Icons.Person /> <div>Client name</div>
            </div>
            <div>
              The ultimate app for your Apple Watch. Enhance your experience
              with custom watch faces, health tracking, and more.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
