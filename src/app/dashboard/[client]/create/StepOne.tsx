"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useState, KeyboardEvent, ChangeEvent, useEffect } from "react";
import { Icons } from "@/components/ui/Icons";
import { useFormStore, useProjectStore } from "@/store";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebase";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User } from "firebase/auth";

interface FileType {
  url: string;
  name: string;
  type: string;
  createdAt: number;
  bucketName: string;
}
interface StepOneProps {
  onNext: () => void;
}

const StepOne: React.FC<StepOneProps> = ({ onNext }) => {
  const [chips, setChips] = useState<string[]>([]);
  const [ideahint, setIdeaHint] = useState<string>("");
  const { project, setproject } = useProjectStore();
  const [inputValue, setInputValue] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const params = useParams();
  const clientid = params.client;
  const searchParams = useSearchParams();
  const projectDocId = searchParams.get("projectid");
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [files, setFiles] = useState<FileType[]>([]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          const docRef = doc(
            db,
            `users/${user.uid}/clients/${clientid}/projects/${projectDocId}`
          );
          const docSnap = await getDoc(docRef);
          console.log(docSnap.exists());
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.Ideas && data.ideaHint) {
              setChips(data.Ideas);
              setIdeaHint(data.ideaHint);
              setSelectedValues(data.selectedFiles);
            }
          }
          fetchfiles(user);
        }
      });

      return () => unsubscribe();
    };

    fetchData();
  }, [clientid, projectDocId]);

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      setChips([...chips, inputValue.trim()]);
      setInputValue("");
    } else if (e.key === "Backspace" && inputValue === "" && chips.length > 0) {
      setChips(chips.slice(0, -1));
    }
  };

  const handleChipDelete = (chipToDelete: string) => {
    setChips(chips.filter((chip) => chip !== chipToDelete));
  };

  function clickNext() {
    if (inputValue.trim() !== "") {
      setChips([...chips, inputValue.trim()]);
      setInputValue("");
      return;
    }

    if (ideahint.trim() === "" || chips.length === 0) {
      setError(true);
    } else {
      setError(false);
      const formData = {
        Ideas: chips,
        ideaHint: ideahint,
        currentStep: 1,
        generatebyai: false,
        selectedFiles: selectedValues,
      };
      updateFormDataInDB(formData);
      onNext();
    }
  }

  function handleGenerateUsingAI() {
    setError(false);
    const formData = {
      generatebyai: true,
      currentStep: 1,
      Ideas: [],
      ideaHint: "",
    };
    updateFormDataInDB(formData);
    onNext();
  }

  const updateFormDataInDB = async (formData: {
    Ideas?: string[];
    ideaHint?: string;
    generatebyai?: boolean;
    currentStep?: number;
  }) => {
    try {
      const docRef = doc(
        db,
        `users/${auth.currentUser?.uid}/clients/${clientid}/projects/${projectDocId}`
      );
      await updateDoc(docRef, formData);
      console.log("Form data updated successfully in the database");
    } catch (error) {
      console.error("Error updating form data:", error);
    }
  };

  const handleSelect = (currentValue: string) => {
    setSelectedValues((prevValues) =>
      prevValues.includes(currentValue)
        ? prevValues.filter((value) => value !== currentValue)
        : [...prevValues, currentValue]
    );
  };

  const fetchfiles = async (user: User) => {
    if (!user?.uid) {
      return [];
    }

    try {
      const docRef = collection(
        db,
        `users/${user.uid}/clients/${params.client}/files`
      );
      const querySnapshot = await getDocs(docRef);
      const files = querySnapshot.docs.map((doc) => doc.data());
      console.log("Fetch successful:", files);
      const totalfiles = files.map((file) => ({
        url: file.url,
        name: file.name,
        originalName: file.originalName,
        type: file.type,
        createdAt: file.createdAt,
        bucketName: file.bucketName,
      }));
      totalfiles;
      setFiles(totalfiles);
      console.log(files);
    } catch (error) {
      console.error("Error retrieving files:", error);
      return [];
    }
  };

  return (
    <div className="w-full mt-4 xl:px-52 font-montserrat">
      <div className="p-3 rounded-lg mt-6 flex flex-col gap-6 py-8 lg:pl-10 items-center">
        <div className="grid w-full max-w-lg items-center gap-3">
          <div className="text-2xl  my-7 text-[#545454] font-medium">
            Pitch Info
          </div>
          <div>
            <Label htmlFor="email">Select Files from Data Library</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div className="flex gap-4 items-center file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 grey shadow-none outline-none border-0 rounded-lg p-1 mt-2">
                  <div
                    role="combobox"
                    aria-expanded={open}
                    className="flex flex-wrap w-full min-h-9 rounded-md px-1 py-1 text-sm transition-colors min-h-11 "
                  >
                    {selectedValues && selectedValues.length > 0 ? (
                      <div className="  flex gap-2 items-center flex-wrap">
                        {selectedValues.map((value) => (
                          <div
                            key={value}
                            className="bg-[#E9E7E4] bg-secondary p-2 px-4 rounded-full justify-center items-center gap-2 text-sm flex"
                          >
                            <div>
                              {
                                files.find((file) => file.bucketName === value)
                                  ?.bucketName?.slice(0, 10).concat("...")
                              }
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelect(value);
                              }}
                              className="text-red-500 ml-1"
                            >
                              <Icons.Cross />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[#545454]">Select Files</div>
                    )}
                  </div>

                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] p-0 font-montserrat">
                <Command>
                  <CommandInput placeholder="Search files..." />
                  <CommandList className="capitalize text-left">
                    <CommandEmpty>No files found.</CommandEmpty>
                    <CommandGroup>
                      {files.map((file) => (
                        <CommandItem
                          key={file.bucketName}
                          value={file.bucketName}
                          onSelect={() => handleSelect(file.bucketName)}
                        >
                          <Check
                            className={cn(
                              "mr-2 min-h-4 min-w-4 max-h-4 max-w-4",
                              selectedValues.includes(file.bucketName)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {file.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <Label htmlFor="email">Idea hint</Label>
          <Input
            placeholder="Idea hint"
            value={ideahint}
            onChange={(e) => {
              setIdeaHint(e.target.value);
            }}
            className="grey shadow-none outline-none border-0 rounded-lg  h-11"
          />

          {error && (
            <div className="text-destructive text-sm">
              Please enter an idea hint
            </div>
          )}
        </div>
        <div className="grid w-full max-w-lg items-center gap-1.5">
          <Label htmlFor="ideas">Keywords</Label>
          <div>
            <div
              id="ideas"
              className="flex flex-wrap w-full min-h-9 rounded-md border border-input bg-transparent px-1 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 grey shadow-none outline-none border-0 rounded-lg  min-h-11 px-3 py-2 gap-2"
            >
              {chips?.map((chip, index) => (
                <div
                  key={index}
                  className="bg-[#E9E7E4] bg-secondary p-2 px-4 rounded-full justify-center items-center gap-2 text-sm flex"
                >
                  <div>{chip}</div>
                  <button
                    onClick={() => handleChipDelete(chip)}
                    className="text-red-500"
                  >
                    <Icons.Cross />
                  </button>
                </div>
              ))}

              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                placeholder={"Enter Keywords..."}
                className="border-none outline-none bg-transparent flex-grow file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground ml-2 mt-2  mb-1"
              />
            </div>
          </div>
          {error && (
            <div className="text-destructive text-sm">
              Please enter an ideas
            </div>
          )}
          <div className="mt-16">
            <div className="flex items-center justify-between">
              <Button
                className="flex rounded-full px-5 items-center justify-start p-5"
                disabled
              >
                <ArrowLeftIcon className="mr-3" />
              </Button>
              <Button
                className="items-center rounded-full px-14 bg-[#5C5C5C] py-5"
                onClick={clickNext}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
        {/* <div className="flex justify-center items-center">or</div>
            <div className="flex justify-center items-center">
              <Button className="items-center" onClick={handleGenerateUsingAI}>
                Generate using ai
              </Button>
            </div> */}
      </div>
    </div>
  );
};

export default StepOne;
