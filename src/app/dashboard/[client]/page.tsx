"use client";

import { Icons } from "@/components/ui/Icons";
import { useEffect, useState } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { project } from "@/lib/firebase/types";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";
import { auth, db } from "@/lib/firebase/firebase";
import { useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { useClientStore } from "@/store";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Classname must be at least 1 characters.",
    })
    .max(15, {
      message: "Classname must be at most 15 characters.",
    }),
});

const Page = () => {
  const [projects, setProjects] = useState<project[]>([]);
  const { client, setClient } = useClientStore();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const clientid = params.client;
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const fetchData = async () => {
    const authUser = auth.currentUser;
    if (!authUser) return [];
    setLoading(true);
    try {
      const querySnapshot = await getDocs(
        query(
          collection(
            db,
            `users/${auth.currentUser?.uid}/clients/${clientid}/projects`
          ),
          orderBy("createdAt", "desc")
        )
      );

      const clientsWithIds = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as project[];

      return clientsWithIds;
    } catch (error) {
      console.error("Error fetching clients: ", error);
      return [];
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const projectsData = await fetchData();
        setProjects(projectsData);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    const clientData = {
      name: values.name,
      createdAt: Date.now(),
    };

    try {
      const docRef = await addDoc(
        collection(
          db,
          `users/${auth.currentUser?.uid}/clients/${clientid}/projects`
        ),
        clientData
      );
      setOpen(false);

      toast({
        title: "Created a project",
        description: `Project created with name ${values.name}!`,
      });

      router.push(`/dashboard/${clientid}/create?projectid=${docRef.id}`);
    } catch (error) {
      console.error("Error adding Project: ", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full px-5 mt-4 ml-16 sm:ml-44">
      <div className="text-3xl font-bold mt-4 ml-2">
        {client?.name ? client.name : <Skeleton className="h-10 w-[100px]" />}
      </div>
      <Breadcrumb className="ml-2 mt-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>
              {client?.name ? (
                client.name
              ) : (
                <Skeleton className="h-4 w-[20px]" />
              )}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
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
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
            <div className="ml-1">Create a Project</div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Create a Project By entering the name
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
              <Button type="submit" className="ml-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    <div>Creating..</div>
                  </>
                ) : (
                  <>
                    <div>Create</div>
                  </>
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="grid grid-cols-1 mt-5 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <Skeleton className="h-[125px] w-full rounded-xl" />
        </div>
      ) : !loading && projects.length === 0 ? (
        <div className="flex text-center justify-center mt-52">
          No Projects found! Start by creating a project now
        </div>
      ) : (
        <div className="grid grid-cols-1 mt-5 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4">
          {projects.map((project, index) => (
            <div
              key={index}
              className="border rounded-sm p-4 flex gap-2 flex-col"
            >
              <div className="flex  gap-2 items-center">
                <Icons.Person /> <div className="">{project.name}</div>
              </div>
              <div>
                The ultimate app for your Apple Watch. Enhance your experience
                with custom watch faces, health tracking, and more.
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
