"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { ArrowLeftIcon, LucideSparkles, SparklesIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
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
        setJournalists(journalistsData);
        setJournalists(journalistsData);
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

  return (
    <div className="w-full mt-4 xl:px-52 font-montserrat">
      <div className="p-3 rounded-lg mt-6 flex flex-col gap-6 py-8 lg:pl-10 items-center w-full">
        <div className="flex w-full items-center gap-3 text-[#545454] font-medium justify-between text-xl">
          <div>Media Data</div>
          <div className="flex gap-4">
            <div className="text-[#545454] bg-[#EAEAE8] p-2 rounded-[30px] px-3 text-sm">
              <div className="text-[#545454] flex flex-row gap-3 items-center">
                <div> Ai Recommended</div> <SparklesIcon className="h-5 w-5"/>
              </div>
            </div>
            <div className="text-[#545454] bg-[#EAEAE8] p-2 rounded-[30px] px-3 text-sm">
              <Dialog>
                <DialogTrigger>
                  <div className="text-[#545454] flex flex-row gap-2 items-center">
                    <div>Add</div> <PlusIcon className="h-5 w-5"/>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] font-montserrat text-[#545454] min-w-[52vw] min-h-[20vw] p-10 px-12 pb-8">
                  <DialogHeader>
                    <div className="text-xl mt-3 ml-1 font-medium">
                      Add new Client
                    </div>
                  </DialogHeader>
                  <ScrollArea className="h-72 w-full">
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
                                        src={"/avatar.png"}
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
                          src={"/avatar.png"}
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
              <Button className="items-center rounded-full px-14 bg-[#5C5C5C] py-5">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepEnd;
