"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/playgrounddialog";
import { Textarea } from "@/components/ui/textarea";
import { useFormStore, useProjectStore } from "@/store";
import { auth } from "@/lib/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface StepTwoProps {
  onPrevious: () => void;
  onNext: () => void;
}
const StepThree: React.FC<StepTwoProps> = ({ onPrevious, onNext }) => {
  const [openemail, setOpenemail] = useState(false);
  const [opencontent, setOpencontent] = useState(false);
  const { project, setproject } = useProjectStore();
  const [loading, setLoading] = useState(false);
  const { formData, updateFormData } = useFormStore();
  const [pitchContent, setPitchContent] = useState("");
  const [pitchEmail, setPitchEmail] = useState("");

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (user) {
          const response = await fetch(
            "https://pr-ai-99.uc.r.appspot.com/pitch",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_id: user.uid,
                client_id: "deec",
                topic: {
                  idea: "AI-driven personalization for mental health exercises",
                  story:
                    "Explore how MindEase uses AI to tailor mental health exercises for each user's unique needs, leading to more effective outcomes and improved well-being.",
                },
              }),
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch ideas");
          }
          const data = await response.json();
          console.log(data);
          setPitchContent(data.content);
          setPitchEmail(data.email);
        }
      } catch (error) {
        console.error("Error fetching ideas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();

    const unsubscribe = onAuthStateChanged(auth, fetchIdeas);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="w-full mt-4 xl:px-52">
      <div className="">
        <div className="text-3xl font-bold mt-4 ml-2">Pitch options</div>
        <div className="ml-2">Description : {project?.description}</div>
        <div>
          <div className="flex items-center justify-center gap-10">
            <Dialog open={openemail} onOpenChange={setOpenemail}>
              <DialogTrigger asChild>
                <div className="rounded-sm border  flex items-center justify-center p-10 h-52">
                  <Button variant={"outline"} className="w-[10rem]">
                    <div>Pitch Email</div>
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent className="min-w-[90vw] max-h-[90vh] p-0">
                <div>
                  <div className="border rounded-t-lg flex p-4 items-center justify-between">
                    <div>Pitch Email</div>
                    <div className="flex gap-2">
                      <Button>Save</Button>
                      <Button onClick={() => setOpenemail(false)}>Close</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-[1fr_230px]">
                    <div className="flex flex-col space-y-4 p-5 border-r">
                      <Textarea
                        placeholder="We're writing to amazon. Congrats from OpenAI!"
                        className="h-full min-h-[75vh]"
                        value={pitchEmail}
                        onChange={(e) => setPitchEmail(e.target.value)}
                      />
                    </div>

                    <div className="p-5 flex flex-col gap-3">
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={opencontent} onOpenChange={setOpencontent}>
              <DialogTrigger asChild>
                <div className="rounded-sm border  flex items-center justify-center p-10 h-52">
                  <Button variant={"outline"} className="w-[10rem]">
                    <div>Pitch Content</div>
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent className="min-w-[90vw] max-h-[90vh] p-0">
                <div>
                  <div className="border rounded-t-lg flex p-4 items-center justify-between">
                    <div>Pitch Content</div>{" "}
                    <div className="flex gap-2">
                      <Button>Save</Button>
                      <Button onClick={() => setOpencontent(false)}>
                        Close
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-[1fr_230px]">
                    <div className="flex flex-col space-y-4 p-5 border-r">
                      <Textarea
                        placeholder="We're writing to amazon. Congrats from OpenAI!"
                        className="h-full min-h-[75vh]"
                        value={pitchContent}
                        onChange={(e) => setPitchContent(e.target.value)}
                      />
                    </div>

                    <div className="p-5 flex flex-col gap-3">
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-4 sm:mx-2">
            <div className="flex items-center justify-between">
              <Button className="items-center" onClick={onPrevious}>
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

export default StepThree;
