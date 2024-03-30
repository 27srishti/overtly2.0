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
import {
  IdeasandMailStore,
  useClientStore,
  useFormStore,
  useProjectStore,
} from "@/store";
import { auth, db } from "@/lib/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Editor } from "@tinymce/tinymce-react";
import { Icons } from "@/components/ui/Icons";
import { doc, updateDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
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
  const { mail, setMail } = IdeasandMailStore();
  const editorRef1 = useRef<any>(null);
  const editorRef2 = useRef<any>(null);
  const { client, setClient } = useClientStore();
  const searchParams = useSearchParams();
  const projectDocId = searchParams.get("projectid");

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        if (mail.content !== "" && mail.email !== "") {
          setLoading(false);
          return;
        }

        const response = await fetch(
          "https://pr-ai-99.uc.r.appspot.com/pitch",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: user.uid,
              client_id: client?.id,
              topic: {
                idea: formData.topic.idea,
                story: formData.topic.story,
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        console.log(data);
        setMail({
          content: data.content,
          email: data.email,
        });
      } catch (error) {
        console.error("Error fetching email:", error);
        setMail({
          content: "Error fetching data. Please try again later.",
          email: "Error fetching data. Please try again later.",
        });
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

  async function Savetodb() {
    try {
      const user = auth.currentUser;
      if (user && client) {
        try {
          const projectDocRef = doc(
            db,
            `users/${user.uid}/clients/${client.id}/projects/${projectDocId}`
          );

          // Update the document with the new project data
          await updateDoc(projectDocRef, {
            formData,
          });

          console.log("Document updated successfully");
        } catch (error) {
          console.error("Error updating document: ", error);
        }
      } else {
        throw new Error("User or client not available");
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  const log = () => {
    const emailContent = editorRef1.current.getContent();

    setMail({
      content: mail.content,
      email: emailContent,
    });
    updateFormData({
      mail: {
        content: emailContent,
        email: mail.email,
      },
    });
    Savetodb();
    setOpenemail(false);
    setOpencontent(false);
  };

  const log2 = () => {
    const emailContent = editorRef2.current.getContent();

    setMail({
      content: emailContent,
      email: mail.email,
    });

    updateFormData({
      mail: {
        content: emailContent,
        email: mail.email,
      },
    });
    setOpenemail(false);
    setOpencontent(false);
  };

  console.log(formData);

  return (
    <div className="w-full mt-4 xl:px-52">
      <div className="">
        <div className="text-3xl font-bold mt-4 ml-2">Pitch options</div>
        <div className="ml-2">Description : {project?.description}</div>
        <div>
          <div className="flex items-center justify-center gap-10">
            <Dialog open={openemail} onOpenChange={setOpenemail} modal={false}>
              <DialogTrigger asChild>
                <div className="rounded-sm border  flex items-center justify-center p-10 h-52">
                  <Button variant={"outline"} className="w-[10rem]">
                    {loading ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Loading Email...
                      </>
                    ) : (
                      <div>Pitch Email</div>
                    )}
                  </Button>
                </div>
              </DialogTrigger>

              <DialogContent
                className="min-w-[90vw] max-h-[90vh] p-0"
                onInteractOutside={(e) => {
                  e.preventDefault();
                }}
              >
                <div>
                  <div className="border rounded-t-lg flex p-4 items-center justify-between">
                    <div>Pitch Email</div>
                    <div className="flex gap-2">
                      <Button onClick={log}>Save</Button>
                      <Button onClick={() => setOpenemail(false)}>Close</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-[1fr_230px]">
                    <div className="flex flex-col space-y-4 p-5 border-r">
                      <Editor
                        apiKey="rkeqnljxwoc8tnbbwrq8fpo4m07kjeuty8sxu6ygfh4pffay"
                        onInit={(evt, editor) => (editorRef1.current = editor)}
                        initialValue={mail.email.replace(/\n/g, "<br>")}
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
            <Dialog
              open={opencontent}
              onOpenChange={setOpencontent}
              modal={false}
            >
              <DialogTrigger asChild>
                <div className="rounded-sm border  flex items-center justify-center p-10 h-52">
                  <Button variant={"outline"} className="w-[10rem]">
                    {loading ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Loading Content...
                      </>
                    ) : (
                      <div>Pitch Content</div>
                    )}
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent
                className="min-w-[90vw] max-h-[90vh] p-0"
                onInteractOutside={(e) => {
                  e.preventDefault();
                }}
              >
                <div>
                  <div className="border rounded-t-lg flex p-4 items-center justify-between">
                    <div>Pitch Content</div>{" "}
                    <div className="flex gap-2">
                      <Button onClick={log2}>Save</Button>
                      <Button onClick={() => setOpencontent(false)}>
                        Close
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-[1fr_230px]">
                    <div className="flex flex-col space-y-4 p-5 border-r">
                      <Editor
                        apiKey="rkeqnljxwoc8tnbbwrq8fpo4m07kjeuty8sxu6ygfh4pffay"
                        onInit={(evt, editor) => (editorRef2.current = editor)}
                        initialValue={mail.content.replace(/\n/g, "<br>")}
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
          </div>
          <div className="mt-4 sm:mx-2">
            <div className="flex items-center justify-between">
              <Button className="items-center" onClick={onPrevious}>
                Previous
              </Button>
              <Button className="items-center" onClick={Savetodb} disabled>
                End
              </Button>
              {/* <Button className="items-center" onClick={onNext} disabled>
                Next
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepThree;
