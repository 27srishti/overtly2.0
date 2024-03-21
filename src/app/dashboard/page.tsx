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
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Demographics, Industry } from "@/lib/dropdown";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Classname must be at least 1 characters.",
    })
    .max(15, {
      message: "Classname must be at most 15 characters.",
    }),
  industry: z.string({
    required_error: "Please select an Subdomain to display.",
  }),
  // domain: z
  //   .string()
  //   .min(1, {
  //     message: "Subject must be at least 1 characters.",
  //   })
  //   .max(15, {
  //     message: "Subject must be at most 15 characters.",
  //   }),
  // subDomain: z.string({
  //   required_error: "Please select an Subdomain to display.",
  // }),
  demographics: z.string({
    required_error: "Please select an Subdomain to display.",
  }),
});

const Page = () => {
  const [clients, setClients] = useState<client[]>([]);
  const { client, setClient } = useClientStore();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
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
        const clientData = await fetchData();
        setClients(clientData);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [authUser]);

  // console.log(clients);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    setSubmitting(true);
    const clientData: client = {
      name: values.name,
      industry: values.industry,
      // domain: values.domain,
      demographics: values.demographics,
      createdAt: Date.now(),
    };

    try {
      const docRef = await addDoc(
        collection(db, `users/${auth.currentUser?.uid}/clients`),
        clientData
      );
      setOpen(false);
      // const updatedClientData = await fetchData();
      // setClients(updatedClientData);

      toast({
        title: "Create Client",
        description: `Client created with name ${values.name}!`,
      });

      setClient(clientData);
      router.push(`dashboard/${docRef.id}`);
    } catch (error) {
      console.error("Error adding client: ", error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div>
      <Navbar />
      <div className="container px-5">
        <div className="text-3xl font-bold mt-4 ml-2">Dashboard</div>
        <Dialog open={open} onOpenChange={setOpen}>
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
              <div className="ml-1">Create Client</div>
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
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
                {/* <FormField
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
                /> */}
                {/* <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Domain" />
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
                /> */}
                {/* <FormField
                  control={form.control}
                  name="subDomain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Sub Domain" />
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
                              {/* <SelectItem value="apple">Apple</SelectItem>
                              <SelectItem value="banana">Banana</SelectItem>
                              <SelectItem value="blueberry">
                                Blueberry
                              </SelectItem>
                              <SelectItem value="grapes">Grapes</SelectItem>
                              <SelectItem value="pineapple">
                                Pineapple
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <Input placeholder="Ex: India"  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
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
                          <SelectTrigger className="w-full">
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
                              {/* <SelectItem value="apple">Apple</SelectItem>
                              <SelectItem value="banana">Banana</SelectItem>
                              <SelectItem value="blueberry">
                                Blueberry
                              </SelectItem>
                              <SelectItem value="grapes">Grapes</SelectItem>
                              <SelectItem value="pineapple">
                                Pineapple
                              </SelectItem> */}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {/* <Input placeholder="Ex: India"  /> */}
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
        ) : !loading && clients.length === 0 ? (
          <div className="flex text-center justify-center mt-52">
            No Clients found! Start by creating a client now
          </div>
        ) : (
          <div className="grid grid-cols-1 mt-5 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4">
            {clients.map((client, index) => (
              <div
                key={index}
                className="border rounded-sm p-4 flex gap-2 flex-col cursor-pointer hover:bg-secondary transition"
                onClick={() => {
                  setClient(client);
                  router.push(`/dashboard/${client.id}`);
                }}
              >
                <div className="flex gap-2 items-center">
                  <Icons.Person />{" "}
                  <div className="font-bold capitalize">{client.name}</div>
                </div>
                <div>
                  {`Industry : ${client.industry}`}
                  <br />
                  {/* {`Domain : ${client.domain}`} */}
                  {/* <br /> */}
                  {`Demographics : ${client.demographics}`}
                  <br />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
