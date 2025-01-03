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
import { useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { Editor } from "@tinymce/tinymce-react";
import { Icons } from "@/components/ui/Icons";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeftIcon } from "lucide-react";
import { logErrorToFirestore } from "@/lib/firebase/logs";
interface StepTwoProps {
  onPrevious: () => void;
  onNext: () => void;
}
const StepThree: React.FC<StepTwoProps> = ({ onPrevious, onNext }) => {
  const [openemail, setOpenemail] = useState(false);
  const [opencontent, setOpencontent] = useState(false);
  const { project, setproject } = useProjectStore();
  const [loading, setLoading] = useState(false);
  const editorRef1 = useRef<any>(null);
  const editorRef2 = useRef<any>(null);
  const searchParams = useSearchParams();
  const projectDocId = searchParams.get("projectid");
  const params = useParams();
  const clientid = params.client;
  const [fetchedValues, setFetchedValues] = useState<{
    generatedMail: string;
    generatedContent: string;
  }>({
    generatedMail: "",
    generatedContent: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (user) {
            const docRef = doc(
              db,
              `users/${user.uid}/clients/${clientid}/projects/${projectDocId}`
            );
            const docSnap = await getDoc(docRef);
            console.log(docSnap.exists());
            if (docSnap.exists()) {
              const firebasedata = docSnap.data();
              if (firebasedata.generatedContent && firebasedata.generatedMail) {
                setFetchedValues({
                  generatedContent: firebasedata.generatedContent,
                  generatedMail: firebasedata.generatedMail,
                });
              } else {
                const response = await fetch(
                  "https://pr-ai-99.uc.r.appspot.com/pitch",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${await user?.getIdToken()}`,
                    },
                    body: JSON.stringify({
                      client_id: clientid,
                      topic: {
                        idea: firebasedata.selectedGeneratedIdea.idea,
                        story: firebasedata.selectedGeneratedIdea.story,
                        media_format: firebasedata.mediaFormat,
                        beat: firebasedata.beat,
                        outlet: firebasedata.outlet,
                        objective: firebasedata.objective,
                      },
                    }),
                  }
                );

                if (!response.ok) {
                  toast({
                    title: "Error",
                    description: "Something went wrong",
                    variant: "destructive",
                  });

                  await logErrorToFirestore(
                    auth.currentUser?.uid as string,
                    clientid as string,
                    "pitch",
                    response.statusText,
                    {
                      idea: firebasedata.selectedGeneratedIdea.idea,
                      story: firebasedata.selectedGeneratedIdea.story,
                      media_format: firebasedata.mediaFormat,
                      beat: firebasedata.beat,
                      outlet: firebasedata.outlet,
                      objective: firebasedata.objective,
                    }
                  ); // Log the error
                }

                const data = await response.json();
                console.log(data);
                setFetchedValues({
                  generatedContent: data.content,
                  generatedMail: data.email,
                });
              }
            }
            setLoading(false);
          }
        });

        return () => unsubscribe();
      } catch (error: any) {
        console.error("Error fetching data:", error);
        await logErrorToFirestore(
          auth.currentUser?.uid as string,
          clientid as string,
          "pitch",
          error.message
        ); // Log the error
        setLoading(false);
      }
    };
    fetchData();
  }, [clientid, projectDocId]);

  const updateDatatodb = async (formData: {
    generatedMail: string;
    generatedContent: string;
    currentStep: number;
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

  const log = () => {
    const emailChanges = editorRef1.current.getContent();
    setFetchedValues({
      generatedContent: fetchedValues.generatedContent,
      generatedMail: emailChanges,
    });
    updateDatatodb({
      generatedContent: fetchedValues.generatedContent,
      generatedMail: emailChanges,
      currentStep: 4,
    });
    setOpenemail(false);
    setOpencontent(false);
  };

  const log2 = () => {
    const contentChanges = editorRef2.current.getContent();
    setFetchedValues({
      generatedContent: contentChanges,
      generatedMail: fetchedValues.generatedMail,
    });
    updateDatatodb({
      generatedContent: contentChanges,
      generatedMail: fetchedValues.generatedMail,
      currentStep: 4,
    });
    setOpenemail(false);
    setOpencontent(false);
  };

  return (
    <div className="w-full mt-4 xl:px-52 font-montserrat flex justify-between flex-col items-center">
      <div className="flex flex-col gap-10">
        <div className="text-2xl  my-7 text-[#545454]">Pitch options</div>
        <div className="flex items-center justify-center gap-32">
          <Dialog open={openemail} onOpenChange={setOpenemail} modal={false}>
            <DialogTrigger asChild>
              <div className="rounded-sm flex items-center justify-center p-10 bg-[#F5F4F4] w-[250px] rounded-xl h-44">
                {loading ? (
                  <div className="flex items-center">
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Loading Email...
                  </div>
                ) : (
                  <div>View Pitch Email</div>
                )}
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
                      apiKey="aexcsvbulsalxg40tjwcyuxzdm6jokyk053gls77jawwdepg"
                      onInit={(evt, editor) => (editorRef1.current = editor)}
                      initialValue={
                        fetchedValues.generatedMail
                          ? fetchedValues.generatedMail.replace(/\n/g, "<br>")
                          : ""
                      }
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
              <div className="rounded-sm flex items-center justify-center p-10 h-44 bg-[#F5F4F4] min-w-[250px] rounded-xl">
                {loading ? (
                  <div className="flex items-center">
                    <Icons.spinner className="mr-2 h-4 min-w-4 animate-spin" />
                    Loading Content...
                  </div>
                ) : (
                  <div>View Pitch Content</div>
                )}
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
                    <Button onClick={() => setOpencontent(false)}>Close</Button>
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_230px]">
                  <div className="flex flex-col space-y-4 p-5 border-r">
                    <Editor
                      apiKey="aexcsvbulsalxg40tjwcyuxzdm6jokyk053gls77jawwdepg"
                      onInit={(evt, editor) => (editorRef2.current = editor)}
                      initialValue={
                        fetchedValues.generatedContent
                          ? fetchedValues.generatedContent.replace(
                              /\n/g,
                              "<br>"
                            )
                          : ""
                      }
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
        <div className="mt-24 sm:mx-2">
          <div className="flex items-center justify-between">
            <Button
              className="items-center rounded-full px-6 bg-[#5C5C5C]"
              onClick={onPrevious}
            >
              <ArrowLeftIcon />
            </Button>
            <Button
              className="items-center rounded-full px-14 bg-[#5C5C5C]"
              disabled
            >
              Next
            </Button>
            {/* <Button className="items-center" onClick={onNext} disabled>
                Next
              </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepThree;
