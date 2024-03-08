"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import { Icons } from "@/components/ui/Icons";

interface StepOneProps {
  onNext: () => void;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      firstName: string;
      lastName: string;
      email: string;
    }>
  >;
}

const StepOne: React.FC<StepOneProps> = ({ onNext, formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [inputValue, setInputValue] = useState<string>("");
  const [chips, setChips] = useState<string[]>([]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

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

  console.log(chips);

  return (
    <div className="w-full mt-4 xl:px-52">
      <div className="">
        <div className="text-3xl font-bold mt-4 ml-2">Create a project</div>
        <div className="ml-2">Client Name - Apple</div>
        <div>
          <div className="border p-3 rounded-lg mt-6 flex flex-col gap-6 py-8 lg:pl-10">
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="email">Idea hint</Label>
              <Input type="email" id="email" placeholder="Idea hint" />
            </div>
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="ideas">Ideas</Label>
              <div>
                <div id="ideas" className="flex flex-wrap flex w-full min-h-9 rounded-md border border-input bg-transparent px-1 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                  {chips.map((chip, index) => (
                    <div
                      key={index}
                      className="border bg-secondary p-1 pl-2 rounded-lg flex justify-center items-center gap-2 text-sm gap-2 flex ml-2 mb-1"
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
                    placeholder={"Enter chips..."}
                    className="border-none outline-none bg-transparent flex-grow file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground ml-2 mt-2 ml-2 mb-1"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">or</div>
            <div className="flex justify-center items-center">
              <Button className="items-center">Generate using ai</Button>
            </div>
          </div>
          <div className="mt-4 sm:mx-2">
            <div className="flex items-center justify-between">
              <Button className="items-center" disabled>
                Previous
              </Button>
              <Button className="items-center" onClick={onNext}>
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
