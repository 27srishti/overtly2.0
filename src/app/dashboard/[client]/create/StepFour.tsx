"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
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
import { FocusScope } from "@radix-ui/react-focus-scope";
import { Editor } from "@tinymce/tinymce-react";
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
  const editorRef = useRef<any>(null);
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

  useEffect(() => {
    // Disable Radix ui dialog pointer events lockout
    setTimeout(() => (document.body.style.pointerEvents = ""), 0);
  });
  const parentRef = useRef<any>(null);
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

              <DialogContent
                className="min-w-[90vw] max-h-[90vh] p-0"
                onInteractOutside={(e) => {
                  const classes: string[] = [];

                  e.composedPath().forEach((el: EventTarget | HTMLElement) => {
                    if (
                      (el as HTMLElement).classList &&
                      (el as HTMLElement).classList.length > 0
                    ) {
                      console.log(el);
                      classes.push(
                        ...Array.from((el as HTMLElement).classList)
                      );
                    }
                  });

                  // Check if any of the classes contain the specified class names
                  const classNamesToCheck: string[] = [
                    "tox-menu-nav__js",
                    "tox-swatches__row",
                  ];
                  if (
                    classNamesToCheck.some((className) =>
                      classes.includes(className)
                    )
                  ) {
                    e.preventDefault();
                  }
                }}
              >
                <div ref={parentRef}>
                  <div className="border rounded-t-lg flex p-4 items-center justify-between">
                    <div>Pitch Email</div>
                    <div className="flex gap-2">
                      <Button>Save</Button>
                      <Button onClick={() => setOpenemail(false)}>Close</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-[1fr_230px]">
                    <div className="flex flex-col space-y-4 p-5 border-r">
                      <Editor
                        apiKey="rkeqnljxwoc8tnbbwrq8fpo4m07kjeuty8sxu6ygfh4pffay"
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        initialValue="<p>This is the initial content of the editor.</p>"
                        init={{
                          height: 500,
                          menubar: false,
                          plugins: [
                            "advlist",
                            "autolink",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "preview",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "code",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "code",
                            "help",
                            "wordcount",
                          ],
                          toolbar:
                            "undo redo | blocks | " +
                            "bold italic forecolor | alignleft aligncenter " +
                            "alignright alignjustify | bullist numlist outdent indent | " +
                            "removeformat",
                          content_style:
                            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px}",
                        }}
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
