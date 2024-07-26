"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { ArrowLeftIcon, SparklesIcon } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusIcon } from "@radix-ui/react-icons";
import { auth, db } from "@/lib/firebase/firebase";
import { toast } from "@/components/ui/use-toast";

interface Journalist {
  email: string;
  industry: string;
  location: string;
  name: string;
  outlet: string;
  phone: string;
  publication: string;
  title: string;
}

const StepEnd: React.FC<{ onPrevious: () => void }> = ({ onPrevious }) => {
  const [journalists, setJournalists] = useState<Journalist[]>([]);
  const [selectedJournalists, setSelectedJournalists] = useState<Journalist[]>(
    []
  );
  const searchParams = useSearchParams();
  const projectDocId = searchParams.get("projectid");
  const [user, setUser] = useState<User | null>(null);
  const params = useParams();
  const clientid = params.client;

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchJournalists(currentUser.uid, clientid as string);
      } else {
        setJournalists([]);
      }
    });

    return () => unsubscribe();
  }, [clientid]);

  async function fetchJournalists(userId: string, clientid: string) {
    try {
      const db = getFirestore();
      const clientDocRef = doc(db, `users/${userId}/clients`, clientid);
      const clientSnapshot = await getDoc(clientDocRef);

      if (clientSnapshot.exists()) {
        const journalistsData = clientSnapshot.data()?.journalists || [];
        const selectedJournalists =
          clientSnapshot.data()?.selectedJournalists || [];
        setJournalists(journalistsData);
        setSelectedJournalists(selectedJournalists);
      } else {
        setJournalists([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setJournalists([]);
    }
  }

  const handleSelectJournalist = (journalist: Journalist) => {
    setSelectedJournalists((prev) => {
      if (prev.find((j) => j.email === journalist.email)) {
        return prev.filter((j) => j.email !== journalist.email);
      }
      return [...prev, journalist];
    });
  };

  const updateFormDataInDB = async (formData: {
    selectedJournalists: Journalist[];
    currentStep: number;
  }) => {
    try {
      const docRef = doc(
        db,
        `users/${auth.currentUser?.uid}/clients/${clientid}`
      );
      await updateDoc(docRef, formData).then(() => {
        toast({
          description: "Form data updated successfully in the database",
          title: "Success",
        });
      });
      console.log("Form data updated successfully in the database");
    } catch (error) {
      console.error("Error updating form data:", error);
    }
  };

  function clickNext() {
    const formData = {
      selectedJournalists,
      currentStep: 5,
    };
    updateFormDataInDB(formData);
  }

  return (
    <div className="w-full mt-4 xl:px-52 font-montserrat">
      <div className="p-3 rounded-lg mt-6 flex flex-col gap-6 py-8 lg:pl-10 items-center w-full">
        <div className="flex w-full items-center gap-3 text-[#545454] font-medium justify-between text-xl">
          <div>Media Data</div>
          <div className="flex gap-4">
            <div className="text-[#545454] bg-[#EAEAE8] p-[.7rem] rounded-[30px] px-3 text-sm">
              <div className="text-[#545454] flex flex-row gap-3 items-center font-montserrat text-[12px] font-medium px-3">
                <div> AI Recomended</div> <SparklesIcon className="h-4 w-4" />
              </div>
            </div>
            <div className="text-[#545454] bg-[#EAEAE8] p-[.7rem] rounded-[30px] px-3 text-sm">
              <Dialog>
                <DialogTrigger>
                  <div className="text-[#545454] flex flex-row gap-3 items-center font-montserrat text-[13px] font-medium px-3">
                    <div>Add</div> <PlusIcon className="h-4 w-4" />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-[90vw] max-h-[90vh] p-10 px-12 pb-8 font-montserrat pt-5">
                  <DialogHeader>
                    <div className="text-xl mt-3 ml-1 font-medium">
                      Select Jounalist
                    </div>
                  </DialogHeader>
                  <div className="w-full flex flex-col items-center justify-center border rounded-[30px] p-6">
                    <ScrollArea className="max-h-[70vh] w-full">
                      <div>
                        <div>
                          {journalists.length > 0 ? (
                            <Table className="border-separate border-spacing-y-4">
                              <TableHeader className="bg-[#F7F7F7]">
                                <TableRow className="rounded-xl">
                                  <TableHead className="rounded-l-xl">
                                    Select
                                  </TableHead>
                                  <TableHead>Profile</TableHead>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Email</TableHead>
                                  <TableHead>Industry</TableHead>
                                  <TableHead>Location</TableHead>
                                  <TableHead>Outlet</TableHead>
                                  <TableHead>Phone</TableHead>
                                  <TableHead>Publication</TableHead>
                                  <TableHead className="rounded-r-xl">
                                    Title
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {journalists.map((journalist) => (
                                  <TableRow
                                    key={journalist.email}
                                    className="bg-[#F7F7F7]"
                                  >
                                    <TableCell className="rounded-l-xl ">
                                      <input
                                        type="checkbox"
                                        className="ml-2"
                                        checked={selectedJournalists.some(
                                          (j) => j.email === journalist.email
                                        )}
                                        onChange={() =>
                                          handleSelectJournalist(journalist)
                                        }
                                      />
                                    </TableCell>
                                    <TableCell>
                                      {" "}
                                      <Avatar className="h-10 w-10">
                                        <AvatarImage
                                          src={"/profile.png"}
                                          alt="profileimage"
                                          className="h-10 w-10"
                                        />
                                        <AvatarFallback>CH</AvatarFallback>
                                      </Avatar>
                                    </TableCell>
                                    <TableCell>{journalist.name}</TableCell>
                                    <TableCell>{journalist.email}</TableCell>
                                    <TableCell>{journalist.industry}</TableCell>
                                    <TableCell>{journalist.location}</TableCell>
                                    <TableCell>{journalist.outlet}</TableCell>
                                    <TableCell>{journalist.phone}</TableCell>
                                    <TableCell>
                                      {journalist.publication}
                                    </TableCell>
                                    <TableCell className="rounded-r-xl">
                                      {journalist.title}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <div>No data available</div>
                          )}
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <div className="border border-[#EAEAE8] w-full rounded-[30px] items-center flex justify-center min-h-[300px] p-5">
          {selectedJournalists.length > 0 ? (
            <Table className="border-separate border-spacing-y-4">
              <TableHeader className="bg-[#F7F7F7]">
                <TableRow className="rounded-xl">
                  <TableHead className="rounded-l-xl">Profile</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Outlet</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Publication</TableHead>
                  <TableHead className="rounded-r-xl">Title</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedJournalists.map((journalist) => (
                  <TableRow key={journalist.email}>
                    <TableCell>
                      {" "}
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={"/profile.png"}
                          alt="profileimage"
                          className="h-10 w-10"
                        />
                        <AvatarFallback>CH</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{journalist.name}</TableCell>
                    <TableCell>{journalist.email}</TableCell>
                    <TableCell>{journalist.industry}</TableCell>
                    <TableCell>{journalist.location}</TableCell>
                    <TableCell>{journalist.outlet}</TableCell>
                    <TableCell>{journalist.phone}</TableCell>
                    <TableCell>{journalist.publication}</TableCell>
                    <TableCell className="rounded-r-xl">
                      {journalist.title}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div>No selected journalists</div>
          )}
        </div>
        <div className="w-full">
          <div className="mt-4 sm:mx-2">
            <div className="flex items-center justify-between">
              <Button
                className="flex rounded-full px-5 items-center justify-start pr-8 p-5 bg-[#5C5C5C]"
                onClick={onPrevious}
              >
                <ArrowLeftIcon className="mr-3" />
              </Button>
              <Button
                className="items-center rounded-full px-14 bg-[#5C5C5C] py-5"
                onClick={clickNext}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepEnd;
