"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, KeyboardEvent, ChangeEvent, useEffect } from "react";
import { Icons } from "@/components/ui/Icons";
import { useFormStore, useProjectStore } from "@/store";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebase";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";

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
            }
          }
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

  return (
    <div className="w-full mt-4 xl:px-52">
      <div className="">
        <div className="text-3xl font-bold mt-4 ml-2">Create a project</div>
        <div className="ml-2">Description : {project?.description}</div>
        <div>
          <div className="border p-3 rounded-lg mt-6 flex flex-col gap-6 py-8 lg:pl-10 items-center">
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="email">Idea hint</Label>
              <Input
                placeholder="Idea hint"
                value={ideahint}
                onChange={(e) => {
                  setIdeaHint(e.target.value);
                }}
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
                  className="flex flex-wrap w-full min-h-9 rounded-md border border-input bg-transparent px-1 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {chips?.map((chip, index) => (
                    <div
                      key={index}
                      className="border bg-secondary p-1 pl-2 rounded-lg justify-center items-center gap-2 text-sm flex ml-2 mb-1"
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
            </div>
            <div className="flex justify-center items-center">or</div>
            <div className="flex justify-center items-center">
              <Button className="items-center" onClick={handleGenerateUsingAI}>
                Generate using ai
              </Button>
            </div>
          </div>
          <div className="mt-4 sm:mx-2">
            <div className="flex items-center justify-between">
              <Button className="items-center" disabled>
                Previous
              </Button>
              <Button className="items-center" onClick={clickNext}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepOne;
