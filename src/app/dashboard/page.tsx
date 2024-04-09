"use client";

import { Icons } from "@/components/ui/Icons";
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
import { MoreHorizontal, PlusCircle } from "lucide-react";
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
import Navbar from "@/components/Customcomponent/Navbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebase";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { client } from "@/lib/firebase/types";
import { useClientStore } from "@/store";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Demographics, Industry } from "@/lib/dropdown";
import { Trash2 } from "lucide-react";
import { Pencil2Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Separator } from "@radix-ui/react-dropdown-menu";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Classname must be at least 1 characters.",
    })
    .max(25, {
      message: "Classname must be at most 15 characters.",
    }),
  industry: z.string().min(1, {
    message: "Please select Industry.",
  }),
  demographics: z.string().min(1, {
    message: "Please select Demographics.",
  }),
});

const Page = () => {
  const [clients, setClients] = useState<client[]>([]);
  const { client, setClient } = useClientStore();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedClientId, setEditedClientId] = useState("");
  const router = useRouter();
  const authUser = auth.currentUser;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const fetchData = async () => {
    if (!authUser) return [];
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, `users/${authUser.uid}/clients`),
          orderBy("createdAt", "desc")
        )
      );

      const clientsWithIds = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as client[];

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
        const clientData = await fetchData();
        setClients(clientData);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [authUser]);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    setSubmitting(true);
    const clientData: client = {
      name: values.name,
      industry: values.industry,
      demographics: values.demographics,
      createdAt: Date.now(),
    };

    try {
      if (editMode) {
        try {
          const updatedClientData = { ...clientData, id: editedClientId };
          await updateDoc(
            doc(db, `users/${auth.currentUser?.uid}/clients`, editedClientId),
            updatedClientData
          );
          setOpen(false);

          toast({
            title: "Updated Client",
            description: `Client updated with name ${values.name}!`,
          });

          setClient(clientData);
          setClients(await fetchData());
          setLoading(false);
        } catch (error) {
          console.error("Error adding client: ", error);
        } finally {
          setSubmitting(false);
        }
      } else {
        try {
          const docRef = await addDoc(
            collection(db, `users/${auth.currentUser?.uid}/clients`),
            clientData
          );
          setOpen(false);

          toast({
            title: "Create Client",
            description: `Client created with name ${values.name}!`,
          });

          setClient({
            id: docRef.id,
            ...clientData,
          });
          router.push(`dashboard/${docRef.id}`);
        } catch (error) {
          console.error("Error adding client: ", error);
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

  const handleEditClient = (client: client) => {
    setEditMode(true);
    setEditedClientId(client.id);
    form.setValue("name", client.name);
    form.setValue("industry", client.industry);
    form.setValue("demographics", client.demographics);
    setOpen(true);
  };

  const handleDeleteClient = async (clientId: string) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await deleteDoc(
          doc(db, `users/${auth.currentUser?.uid}/clients`, clientId)
        );
        const updatedClients = await fetchData();
        setClients(updatedClients);
        setLoading(false);
        toast({
          title: "Client Deleted",
          description: "Client has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting client:", error);
        toast({
          title: "Error",
          description: "An error occurred while deleting the client.",
        });
      }
    }
  };

  return (
    <div className="gradientbg">
      <Navbar />
      <div className="container px-16">
        <div className="flex gap-16 mt-11 mb-14">
          <div className="text-3xl mt-4 ml-2 font-montserrat">Dashboard</div>
          <Dialog
            open={open}
            onOpenChange={(open) => {
              form.setValue("name", "");
              form.setValue("industry", "");
              form.setValue("demographics", "");
              setEditMode(false);
              setOpen(open);
            }}
          >
            <DialogTrigger asChild>
              <Button className="mt-3 gap-7 b-0 shadow-none outline-none hover:bg-[#D5D5D5] p-6 rounded-2xl grey ">
                <div className="ml-1 font-montserrat text-[#545454]">
                  New Client
                </div>
                <PlusCircle className="w-6 h-6 stroke-[#545454] stroke-1" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] font-montserrat text-[#545454] min-w-[35vw] min-h-[28vw] p-10">
              <DialogHeader>
                <div className="text-xl mt-3 ml-1 font-medium">
                  {editMode ? "Update Client" : "Add new Client"}
                </div>
                {/* <DialogDescription>
                  {editMode
                    ? "Update a client. Click save when done."
                    : "Add new Client"}
                </DialogDescription> */}
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-7"
                >
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
                            className="grey shadow-none outline-none border-0 rounded-lg h-11"
                          />
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
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full grey shadow-none outline-none border-0 rounded-lg  h-11">
                              <SelectValue placeholder="Select a Industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Industry</SelectLabel>
                                {Industry.map((demographic) => (
                                  <SelectItem
                                    key={demographic}
                                    value={demographic}
                                  >
                                    {demographic}
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
                    name="demographics"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Demographics</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full grey shadow-none outline-none border-0 rounded-lg  h-11">
                              <SelectValue placeholder="Select a Demography" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Demographics</SelectLabel>
                                {Demographics.map((demographic) => (
                                  <SelectItem
                                    key={demographic}
                                    value={demographic}
                                  >
                                    {demographic}
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
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="rounded-full bg-[#545454] p-5 text-white font-montserrat px-11 mr-1"
                  disabled={submitting}
                  onClick={form.handleSubmit(onSubmit)}
                >
                  {submitting ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      {editMode ? (
                        <div>Updating...</div>
                      ) : (
                        <div>Creating..</div>
                      )}
                    </>
                  ) : (
                    <>{editMode ? <div>Update</div> : <div>Create</div>}</>
                  )}
                </Button>
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
        ) : !loading && clients.length === 0 ? (
          <div className="flex text-center justify-center mt-52">
            No Clients found! Start by creating a client now
          </div>
        ) : (
          <div className="grid grid-cols-1 mt-5 gap-10 sm:grid-cols-3  lg:grid-cols-5">
            {clients.map((client, index) => (
              <div
                key={index}
                className="grey rounded-2xl p-7 flex gap-2 flex-col cursor-pointer hover:bg-secondary transition relative"
                onClick={() => {
                  setClient(client);
                }}
              >
                <Link href={`/dashboard/${client.id}`}>
                  <div className="flex flex-col gap-7 justify-between">
                    <div className="flex gap-4 justify-between">
                      <div className="flex gap-2 items-center">
                        <div className=" capitalize font-montserrat flex  gap-4 text-xl">
                          <img src="/company.png" alt="company"></img>
                          {client.name}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="center"
                              className="rounded-2xl font-montserrat"
                            >
                              {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
                              <DropdownMenuItem
                                onClick={() => handleEditClient(client)}
                                className="text-center items-center flex justify-center p-2 font-normal"
                              >
                                Edit
                              </DropdownMenuItem>
                              <SelectSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteClient(client.id)}
                                className="text-center items-center flex justify-center p-2 font-normal"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                    <div className="font-montserrat capitalize flex gap-1 flex-col">
                      <div>{`${client.industry}`}</div>
                      <div>{`${client.demographics}`}</div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
