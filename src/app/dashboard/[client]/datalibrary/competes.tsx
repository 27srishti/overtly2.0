"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import { auth, db } from "@/lib/firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { collection, addDoc } from "firebase/firestore";
import clearCachesByServerAction from "@/lib/revalidation";

const Competes = () => {
  const [user, setuser] = useState<User | null>(null);
  const params = useParams();
  const clientid = params.client;
  const formSchema = z.object({
    CompanyName: z
      .string()
      .min(1, {
        message: "Name be at least 1 characters.",
      })
      .max(25, {
        message: "name be at most 15 characters.",
      }),
    CompanyURL: z.string().min(1, {
      message: "Please select Industry.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      CompanyName: "",
      CompanyURL: "",
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setuser(authUser);
      }
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = {
      companyName: values.CompanyName,
      companyURL: values.CompanyURL,
    };

    try {
      await addDoc(
        collection(db, `users/${user?.uid}/clients/${clientid}/competes`),
        data
      );

      toast({
        title: "Success",
        description: "Compete has been successfully added.",
      });

      clearCachesByServerAction(params.client as string);
    } catch (error) {
      console.error("Error adding project: ", error);
      toast({
        title: "Error",
        description: "An error occurred while adding the project.",
      });
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <div className="gap-7 b-0 shadow-none outline-none hover:bg-[#e8e8e8] transcition-all rounded-2xl grey transition-all flex items-center px-4 py-[.7rem]">
            <div className="ml-1 font-montserrat text-[#545454]">
              Add Compete
            </div>
            <svg
              //   height="22px"
              viewBox="0 0 22 16"
              width="22px"
              fill="#545454"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.25 9.525V6.275H14V4.775H17.25V1.525H18.75V4.775H22V6.275H18.75V9.525H17.25ZM8 7.5C6.9 7.5 6 7.15 5.3 6.45C4.6 5.75 4.25 4.85 4.25 3.75C4.25 2.65 4.6 1.75 5.3 1.05C6 0.35 6.9 0 8 0C9.1 0 10 0.35 10.7 1.05C11.4 1.75 11.75 2.65 11.75 3.75C11.75 4.85 11.4 5.75 10.7 6.45C10 7.15 9.1 7.5 8 7.5ZM0 15.525V13.175C0 12.5917 0.145833 12.0625 0.4375 11.5875C0.729167 11.1125 1.15 10.7583 1.7 10.525C2.95 9.975 4.06117 9.5875 5.0335 9.3625C6.00583 9.1375 6.99333 9.025 7.996 9.025C8.99867 9.025 9.98333 9.1375 10.95 9.3625C11.9167 9.5875 13.025 9.975 14.275 10.525C14.825 10.775 15.25 11.1333 15.55 11.6C15.85 12.0667 16 12.5917 16 13.175V15.525H0ZM1.5 14.025H14.5V13.175C14.5 12.9083 14.425 12.6542 14.275 12.4125C14.125 12.1708 13.925 11.9917 13.675 11.875C12.4917 11.325 11.4917 10.9625 10.675 10.7875C9.85833 10.6125 8.96667 10.525 8 10.525C7.03333 10.525 6.1375 10.6125 5.3125 10.7875C4.4875 10.9625 3.48333 11.325 2.3 11.875C2.05 11.9917 1.85417 12.1708 1.7125 12.4125C1.57083 12.6542 1.5 12.9083 1.5 13.175V14.025ZM8 6C8.65 6 9.1875 5.7875 9.6125 5.3625C10.0375 4.9375 10.25 4.4 10.25 3.75C10.25 3.1 10.0375 2.5625 9.6125 2.1375C9.1875 1.7125 8.65 1.5 8 1.5C7.35 1.5 6.8125 1.7125 6.3875 2.1375C5.9625 2.5625 5.75 3.1 5.75 3.75C5.75 4.4 5.9625 4.9375 6.3875 5.3625C6.8125 5.7875 7.35 6 8 6Z"
                fill="#6D6D6D"
              />
            </svg>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] font-montserrat text-[#545454] min-w-[35vw] min-h-[23vw] p-5 px-12 pb-8">
          <DialogHeader>
            <div className="text-xl mt-3 ml-1 font-medium">Compete Details</div>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="CompanyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Amazon"
                        {...field}
                        className="grey shadow-none outline-none border-0 rounded-lg h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="CompanyURL"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Any url associated with the compete company"
                        {...field}
                        className="grey shadow-none outline-none border-0 rounded-lg h-11"
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
              className="rounded-full bg-[#545454] p-5 text-white font-montserrat px-11 mr-1 "
              onClick={form.handleSubmit(onSubmit)}
            >
              <div>Add</div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Competes;
