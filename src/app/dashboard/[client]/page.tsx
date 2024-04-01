"use client";

import { Icons } from "@/components/ui/Icons";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";
import { auth, db } from "@/lib/firebase/firebase";
import { useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { useClientStore, useProjectStore } from "@/store";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { Pencil2Icon } from "@radix-ui/react-icons";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Classname must be at least 1 characters.",
    })
    .max(15, {
      message: "Classname must be at most 15 characters.",
    }),
  description: z
    .string()
    .min(1, {
      message: "Classname must be at least 1 characters.",
    })
    .max(200, {
      message: "Classname must be at most 15 characters.",
    }),
});

const Page = () => {
  const [projects, setProjects] = useState<project[]>([]);
  const { client } = useClientStore();
  const { project, setproject } = useProjectStore();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const [projecteditid, setEditedProjectId] = useState<string>("");
  const [editMode, setEditMode] = useState(false);
  const clientid = params.client;
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const fetchData = async () => {
    const authUser = auth.currentUser;
    if (!authUser) return [];
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
        setLoading(true);
        const projectsData = await fetchData();
        setProjects(projectsData);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    const projectData: project = {
      name: values.name,
      description: values.description,
      createdAt: Date.now(),
    };

    try {
      if (editMode) {
        try {
          const updatedClientData = { ...projectData, id: projecteditid };
          await updateDoc(
            doc(
              db,
              `users/${auth.currentUser?.uid}/clients/${clientid}/projects`,
              projecteditid
            ),
            updatedClientData
          );
          setOpen(false);

          toast({
            title: "Updated Client",
            description: `Client updated with name ${values.name}!`,
          });

          setProjects(await fetchData());
          setLoading(false);
        } catch (error) {
          console.error("Error adding client: ", error);
        } finally {
          setSubmitting(false);
        }
      } else {
        try {
          const docRef = await addDoc(
            collection(
              db,
              `users/${auth.currentUser?.uid}/clients/${clientid}/projects`
            ),
            projectData
          );

          toast({
            title: "Created a project",
            description: `Project created with name ${values.name}!`,
          });
          setproject(projectData);
          router.push(
            `/dashboard/${clientid}/create?projectid=${docRef.id}&step=1`
          );
          setOpen(false);
        } catch (error) {
          console.error("Error adding Project: ", error);
        } finally {
          setSubmitting(false);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProject = (Project: project) => {
    setEditMode(true);
    setEditedProjectId(Project.id);
    form.setValue("name", Project.name);
    form.setValue("description", Project.description);
    setOpen(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    console.log(projectId);
    if (window.confirm("Are you sure you want to delete this Project?")) {
      try {
        await deleteDoc(
          doc(
            db,
            `users/${auth.currentUser?.uid}/clients/${clientid}/projects/${projectId}`
          )
        );
        toast({
          title: "Project Deleted",
          description: "Project has been successfully deleted.",
        });
        const projectsData = await fetchData();
        setProjects(projectsData);
      } catch (error) {
        console.error("Error deleting project:", error);
        toast({
          title: "Error",
          description: "An error occurred while deleting the project.",
        });
      }
    }
  };

  const handleProjectClick = async (project: project) => {
    console.log(project);
    setproject(project);
console.log(auth.currentUser?.uid);
    try {
      // Fetch the current step from the database
      const projectDocRef = doc(
        db,
        `users/${auth.currentUser?.uid}/clients/${clientid}/projects/${project.id}`
      );
      const projectDocSnap = await getDoc(projectDocRef);
      if (projectDocSnap.exists()) {
        const currentStep = projectDocSnap.data().currentStep;

        // Redirect to the appropriate URL based on the current step
        router.push(
          `/dashboard/${clientid}/create?projectid=${project.id}&step=${currentStep}`
        );
      } else {
        console.error("Project document does not exist");
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };
  return (
    <div className="w-full px-5 mt-4 ml-16 sm:ml-44">
      <div className="text-3xl font-bold mt-4 ml-2">
        {client?.name ? client.name : <Skeleton className="h-10 w-[100px]" />}
      </div>

      <Dialog
        open={open}
        onOpenChange={(open) => {
          form.setValue("name", "");
          form.setValue("description", "");
          setEditMode(false);
          setOpen(open);
        }}
      >
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
            <div className="ml-1">Create Project</div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editMode ? "Edit Project" : "Create Project"}
            </DialogTitle>
            <DialogDescription>
              {editMode
                ? "Update your project by entering the name"
                : "Create your project by entering the name"}
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
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="ml-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    {editMode ? (
                      <>
                        <div>Updating..</div>
                      </>
                    ) : (
                      <div>Creating..</div>
                    )}
                  </>
                ) : (
                  <>
                    {editMode ? (
                      <>
                        <div>Update</div>
                      </>
                    ) : (
                      <div>Create</div>
                    )}
                  </>
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="grid grid-cols-1 mt-5 gap-3 sm:grid-cols-2  lg:grid-cols-4">
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
        <div className="grid grid-cols-1 mt-5 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((document, index) => (
            <div
              key={index}
              className="border rounded-sm p-4 flex gap-2 flex-col cursor-pointer hover:bg-secondary transition"
              onClick={() => handleProjectClick(document)}
            >
              <div className="flex gap-2 items-center justify-between">
                <div className="flex gap-2 items-center">
                  <Icons.Person />
                  <div className="font-bold capitalize hover:underline">
                    {document.name}
                  </div>
                </div>
                <div className="flex gap-3">
                  <div
                    className=" flex items-center gap-1 cursor-pointer text-center align-center hover:underline"
                    onClick={() => handleEditProject(document)}
                  >
                    <Pencil2Icon className="h-4 w-4" />
                    <div>Edit</div>
                  </div>
                  <div
                    className=" flex items-center gap-1 cursor-pointer text-center align-center hover:underline"
                    onClick={() => handleDeleteProject(document.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <div>Delete</div>
                  </div>
                </div>
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
