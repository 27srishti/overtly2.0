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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SelectSeparator } from "@/components/ui/select";
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
  where,
} from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";
import { auth, db } from "@/lib/firebase/firebase";
import { useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { useClientStore, useProjectStore } from "@/store";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/normaltextarea";
import { MoreHorizontal, PlusCircle, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name be at least 1 characters.",
    })
    .max(15, {
      message: "Name be at most 15 characters.",
    }),
  description: z
    .string()
    .min(1, {
      message: "Description be at least 1 characters.",
    })
    .max(30, {
      message: "Description be at most 30 characters.",
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
  const [maindialog, setmaindialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [deleteId, setDeleteId] = useState("");
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
    const normalizedProjectName = values.name.toLowerCase();
    const projectData: project = {
      name: normalizedProjectName,
      description: values.description,
      currentStep: 1,
      createdAt: Date.now(),
    };

    try {
      // Check if a project with the same name (case insensitive) already exists
      const projectQuery = query(
        collection(
          db,
          `users/${auth.currentUser?.uid}/clients/${clientid}/projects`
        ),
        where("name", "==", normalizedProjectName)
      );
      const projectQuerySnapshot = await getDocs(projectQuery);

      const projects = projectQuerySnapshot.docs.map((doc) => doc.data());
      const duplicateProject = projects.find(
        (project) => project.name.toLowerCase() === normalizedProjectName
      );

      if (duplicateProject) {
        // If a project with the same name exists, show an error and return
        toast({
          title: "Error",
          description: `Project with name ${values.name} already exists!`,
        });
        setSubmitting(false);
        return;
      }

      if (editMode) {
        try {
          const updatedProjectData = { ...projectData, id: projecteditid };
          await updateDoc(
            doc(
              db,
              `users/${auth.currentUser?.uid}/clients/${clientid}/projects`,
              projecteditid
            ),
            updatedProjectData
          );
          setOpen(false);

          toast({
            title: "Updated Project",
            description: `Project updated with name ${values.name}!`,
          });

          setProjects(await fetchData());
          setLoading(false);
        } catch (error) {
          console.error("Error updating project: ", error);
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
          console.error("Error adding project: ", error);
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

  const handleDeleteProject = async () => {
    if (deleteId !== "" && deleteMode) {
      try {
        await deleteDoc(
          doc(
            db,
            `users/${auth.currentUser?.uid}/clients/${clientid}/projects/${deleteId}`
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
        let currentStep = projectDocSnap.data().currentStep;

        if (currentStep === 3 || currentStep === 4) {
          currentStep = 4;
          router.push(
            `/dashboard/${clientid}/create?projectid=${project.id}&step=${currentStep}`
          );
        } else {
          router.push(
            `/dashboard/${clientid}/create?projectid=${project.id}&step=${currentStep}`
          );
        }

        // Redirect to the appropriate URL based on the current step
      } else {
        console.error("Project document does not exist");
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };
  return (
    // <div className="w-full px-5 mt-4 ml-16 sm:ml-44">
    <div className="w-full px-16 mt-4 font-montserrat">
      <div className="flex gap-16 mt-11 mb-14">
        <div className="text-3xl mt-4 ml-2 font-montserrat capitalize">
          {client?.name ? client.name : <Skeleton className="h-10 w-[100px]" />}
        </div>

        <Dialog open={maindialog} onOpenChange={setmaindialog}>
          <DialogTrigger asChild>
            <Button className="mt-3 gap-7 b-0 shadow-none outline-none hover:bg-[#e8e8e8] transc p-6 rounded-2xl grey transition-all">
              <div className="ml-1 font-montserrat text-[#545454]">
                Create Project
              </div>
              <PlusCircle className="w-6 h-6 stroke-[#545454] stroke-1" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] font-montserrat text-[#545454] min-w-[60vw] min-h-[35vw] p-10 px-12">
            <div>
              <div className="mb-10">
                <div className="text-xl mt-3 ml-1 mb-5 font-medium ">
                  Choose Workflow
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 gap-y-10">
                <div
                  className="bg-[#D5D5D5] bg-opacity-25 rounded-[25px] p-5 flex flex-col gap-6 max-w-[285px] h-[160px] justify-center cursor-pointer hover:bg-[#e8e8e8]  transition-all duration-300 "
                  onClick={() => {
                    setmaindialog(false);
                    setOpen(true);
                  }}
                >
                  <div>
                    <img src="/colourbox.png" />
                  </div>
                  <div>
                    <div>Pitch Generation</div>
                    <div className="font-regular text-[13px] font-inter text-[#868484]">
                      Ideas {"->"} Pitch {"->"} Distribution
                    </div>
                  </div>
                </div>
                <div className="bg-[#D5D5D5] bg-opacity-25 rounded-[25px] p-5 flex flex-col gap-6 max-w-[285px] h-[160px] justify-center cursor-pointer hover:bg-[#e8e8e8]  transition-all duration-300 ">
                  <div>
                    <img src="/colourbox.png" />
                  </div>
                  <div>
                    <div>Press Release Gen</div>
                    <div className="font-regular text-[13px] font-inter text-[#868484]">
                      Comming Soon...
                    </div>
                  </div>
                </div>
                <div className="bg-[#D5D5D5] bg-opacity-25 rounded-[25px] p-5 flex flex-col gap-6 max-w-[285px] h-[160px] justify-center cursor-pointer hover:bg-[#e8e8e8]  transition-all duration-300 ">
                  <div>
                    <img src="/colourbox.png" />
                  </div>
                  <div>
                    <div>White-Paper Gen</div>
                    <div className="font-regular text-[13px] font-inter text-[#868484]">
                      Comming Soon...
                    </div>
                  </div>
                </div>
                <div className="bg-[#D5D5D5] bg-opacity-25 rounded-[25px] p-5 flex flex-col gap-6 max-w-[285px] h-[160px] justify-center cursor-pointer hover:bg-[#e8e8e8]  transition-all duration-300 ">
                  <div>
                    <img src="/colourbox.png" />
                  </div>
                  <div>
                    <div>Custom Workflow</div>
                    <div className="font-regular text-[13px] font-inter text-[#868484]">
                      Comming Soon...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
        <div className="flex mt-5 gap-10 flex-wrap">
          {projects.map((document, index) => (
            <div
              key={index}
              className="grey p-7 flex gap-2 flex-col cursor-pointer hover:bg-[#e8e8e8]  relative min-w-[320px] min-h-[180px] max-w-[320px] transition-all duration-300 rounded-[24px] flex-grow-1 flex-1"
              onClick={() => handleProjectClick(document)}
            >
              <div className="flex flex-col gap-7 justify-between">
                <div className="flex gap-4 justify-between">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="capitalize font-montserrat flex gap-4 text-xl max-w-[16ch] overflow-hidden items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="max-h-7 max-w-7 min-h-7 min-w-7"
                            viewBox="0 0 24 24"
                            fill="#545454"
                          >
                            <path d="M0 0h24v24H0V0z" fill="none" />
                            <path d="M12 7V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2h-8zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm9 12h-7v-2h2v-2h-2v-2h2v-2h-2V9h7c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1zm-1-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
                          </svg>
                          <span className="truncate">{document.name}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        align="center"
                        className="bg-[#ffffff] text-[#545454]"
                      >
                        <div className="capitalize">{document.name}</div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <div className="flex gap-3">
                    <div className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="center"
                          className="rounded-2xl font-montserrat"
                        >
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProject(document);
                            }}
                            className="text-center items-center flex justify-center p-2 font-normal"
                          >
                            Edit
                          </DropdownMenuItem>
                          <SelectSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteMode(true);
                              setDeleteId(document.id);
                            }}
                            className="text-center items-center flex justify-center p-2 font-normal"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
                <div className="font-montserrat capitalize flex gap-1 flex-col text-wrap">
                  <div className="break-all">{`${document.description} `}</div>
                  {`E-commerce`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <AlertDialog open={deleteMode} onOpenChange={setDeleteMode}>
        <AlertDialogTrigger asChild className="hidden"></AlertDialogTrigger>
        <AlertDialogContent className="rounded-2xl font-montserrat">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              client details.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                handleDeleteProject();
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setmaindialog(false);
          form.setValue("name", "");
          form.setValue("description", "");
          setEditMode(false);
          setOpen(open);
        }}
      >
        <DialogTrigger asChild>..</DialogTrigger>
        <DialogContent className="sm:max-w-[425px] font-montserrat text-[#545454] min-w-[30vw] min-h-[20vw] p-10 px-12">
          <DialogHeader>
            <DialogTitle className="text-xl mt-3 ml-1 mb-5 font-medium">
              {editMode ? "Edit Project" : "Create Project"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Amazon"
                        {...field}
                        className="w-full grey shadow-none outline-none border-0 rounded-lg  h-11"
                      />
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
                      <Textarea
                        placeholder="Enter Description"
                        {...field}
                        className="w-full grey shadow-none outline-none border-0 rounded-lg  h-11"
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
              className="rounded-full bg-[#545454] p-5 text-white font-montserrat px-11 mr-1 mt-10"
              disabled={submitting}
              onClick={form.handleSubmit(onSubmit)}
            >
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
