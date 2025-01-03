"use client";

import React, {
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  useRouter,
  usePathname,
  useSearchParams,
  useParams,
} from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Icons } from "@/components/ui/Icons";
import { Input } from "@/components/ui/input";
import { Filetypes } from "@/lib/dropdown";
import { DashboardIcon, ListBulletIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { auth, db, storage } from "@/lib/firebase/firebase";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { deleteObject, ref } from "firebase/storage";
import clearCachesByServerAction from "@/lib/revalidation";
import Uploadbtn from "./specificfileupload";
import { logErrorToFirestore } from "@/lib/firebase/logs";
import { Textarea } from "@/components/ui/normaltextarea";

interface File {
  name: string;
  title: string;
  industry: string;
  id: string;
}

export type FilesData = {
  file_type: string | undefined;
  id: string;
  url: string;
  name: string;
  originalName: string;
  type: string;
  createdAt: string;
  bucketName: string;
  filesCategory: string;
};

const FolderView = () => {
  const [list, setList] = useState(false);
  const [filterInput, setFilterInput] = useState("");
  const params = useParams<{ client: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentFiles, setCurrentFiles] = useState("");
  const [files, setFiles] = useState<FilesData[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FilesData[]>(files);
  const [coreContextExists, setCoreContextExists] = useState(false);
  const [companyBioData, setCompanyBioData] = useState<any>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const createQueryString = useCallback(
    (params: { [s: string]: unknown } | ArrayLike<unknown>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      });

      return newSearchParams.toString();
    },
    [searchParams]
  );

  const handleViewModeChange = useCallback(
    (isListView: boolean | ((prevState: boolean) => boolean)) => {
      if (list !== isListView) {
        setList(isListView);
        const queryString = createQueryString({
          view: isListView ? "list" : "folder",
        });
        router.push(`${pathname}?${queryString}`, { scroll: false });
      }
    },
    [list, router, pathname, createQueryString]
  );

  useEffect(() => {
    if (currentFiles) {
      FetchcurrentFiletypefiles();
    }
  }, [currentFiles]);

  useEffect(() => {
    setFilteredFiles(
      files.filter(file =>
        file.name.toLowerCase().includes(filterInput.toLowerCase())
      )
    );
  }, [filterInput, files]);

  const handleFileTypeSelect = (value: string) => {
    setCurrentFiles(value);
  };

  const FetchcurrentFiletypefiles = async () => {
    const authUser = auth.currentUser;

    if (!authUser) {
      console.error("User is not authenticated");
      return;
    }

    try {
      const filesCollectionRef = collection(
        db,
        `users/${authUser.uid}/clients/${params.client}/files`
      );
      const q = query(
        filesCollectionRef,
        where("file_type", "==", currentFiles)
      );

      const querySnapshot = await getDocs(q);
      const fetchedFiles = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FilesData[];

      console.log("Fetched files:", fetchedFiles);
      setFiles(fetchedFiles);
    } catch (error) {
      console.error("Error fetching files from Firestore:", error);
    }
  };

  const handleDeleteFile = async (file: FilesData) => {
    const authUser = auth.currentUser;

    if (!authUser) {
      console.error("User is not authenticated");
      return;
    }

    const storageRef = ref(storage, file.url);

    try {
      await deleteObject(storageRef);
      console.log("File deleted from storage:", file.name);
    } catch (error) {
      console.error("Error deleting file from storage:", error);
      return;
    }

    try {
      const docRef = collection(
        db,
        `users/${authUser?.uid}/clients/${params.client}/files`
      );
      const querySnapshot = await getDocs(docRef);
      const docIdToDelete = querySnapshot.docs.find(
        (doc) => doc.data().name === file.name
      )?.id;

      if (docIdToDelete) {
        await deleteDoc(
          doc(
            db,
            `users/${authUser?.uid}/clients/${params.client}/files`,
            docIdToDelete
          )
        );
        console.log("File metadata deleted from Firestore:", file.name);

        const url = `https://pr-ai-99.uc.r.appspot.com/file`;

        return fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await authUser?.getIdToken()}`,
          },
          body: JSON.stringify({
            client_id: params.client,
            file_name: file.bucketName,
          }),
        })
          .then((response) => {
            console.log(response.json());
          })
          .catch(async (error) => {
            await logErrorToFirestore(authUser.uid, params.client, "file", error.message, {
              client_id: params.client,
              file_name: file.bucketName,
            });
          });
      }
    } catch (error) {
      console.error("Error deleting file metadata from Firestore:", error);
    } finally {
      clearCachesByServerAction(pathname);
      FetchcurrentFiletypefiles();
    }
  };


  const handleOpenCompanyBio = async () => {
    const authUser = auth.currentUser;
    if (!authUser) {
      console.error("User is not authenticated");
      return;
    }

    try {
      const docRef = doc(db, `users/${authUser.uid}/clients/${params.client}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setCoreContextExists(!!data.core_context);
        setCompanyBioData(data.core_context);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setCompanyBioData((prevData: any) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const authUser = auth.currentUser;
    if (!authUser) {
      console.error("User is not authenticated");
      setIsSaving(false);
      return;
    }

    try {
      const docRef = doc(db, `users/${authUser.uid}/clients/${params.client}`);
      await setDoc(docRef, { core_context: companyBioData }, { merge: true });
      console.log("Document successfully updated!");
      setEditingField(null);
    } catch (error) {
      console.error("Error updating document:", error);
    } finally {
      setIsSaving(false);
    }
  };


  const renderedFiletypes = Filetypes.map((option) => (
    <Dialog key={option.value}>
      <DialogTrigger className="text-left">
        <div
          className={`flex flex-col p-5 rounded-[20px] gap-5 text-[#3B3B3B] max-w-[275px] aspect-w-4 aspect-h-3 ${option.color} transition-all duration-300`}
          onClick={() => handleFileTypeSelect(option.value)}
        >
          <div className="flex flex-row justify-between items-center">
            <div
              className="w-[12px] h-[12px] mr-5 p-2 rounded-full h-[32px] w-[32px] bg-[#FFFFFF] bg-opacity-50 flex item-center justify-between"
            >
              <option.icon className="" /> </div>
            <div>
              <Icons.Expand className="w-[12px] h-[12px] mr-5" />
            </div>
          </div>
          <div className="flex flex-col gap-[10px] font-medium font-montserrat">
            <div className="text-[14px] break-words leading-tight">
              {option.value}
            </div>
            <div className="text-[10px] leading-tight">
              This is the second vehicle company Henrik Fisker
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] min-w-[90vw] min-h-[90vh] p-10 px-12 pb-8 font-montserrat pt-5">
        <div>
          <div className="mb-10">
            <div className="text-xl mt-3 ml-1 font-medium mb-2">
              {option.value}
            </div>
          </div>
          <div className="w-full flex flex-col items-center justify-center border rounded-[30px] p-6">
            <ScrollArea className="max-h-[70vh] min-h-[70vh] w-full">
              <div>
                <div className="flex flex-row p-2 w-full justify-between">
                  <div className="flex flex-row gap-3 self-end bg-[#F5F5F0] p-1 rounded-[40px] ">
                    <Input
                      type="search"
                      placeholder="Search Data"
                      className="shadow-none border-none"
                      value={filterInput}
                      onChange={(e) => setFilterInput(e.target.value)} // Update filterInput properly
                    />
                    <div className="bg-[#3E3E3E] rounded-full p-[.6rem] bg-opacity-80">
                      <svg
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-white"
                      >
                        <path
                          d="M6.0651 1.3999C3.49315 1.3999 1.39844 3.49461 1.39844 6.06657C1.39844 8.63852 3.49315 10.7332 6.0651 10.7332C7.18354 10.7332 8.21056 10.3361 9.01549 9.67685L11.8018 12.4632C11.8448 12.508 11.8963 12.5437 11.9533 12.5684C12.0103 12.593 12.0717 12.606 12.1337 12.6066C12.1958 12.6073 12.2574 12.5955 12.3149 12.572C12.3724 12.5486 12.4246 12.5139 12.4685 12.47C12.5124 12.4261 12.5471 12.3738 12.5706 12.3164C12.594 12.2589 12.6058 12.1973 12.6052 12.1352C12.6045 12.0731 12.5915 12.0118 12.5669 11.9548C12.5423 11.8978 12.5065 11.8463 12.4617 11.8033L9.67539 9.01696C10.3346 8.21203 10.7318 7.18501 10.7318 6.06657C10.7318 3.49461 8.63706 1.3999 6.0651 1.3999ZM6.0651 2.33324C8.13275 2.33324 9.79844 3.99892 9.79844 6.06657C9.79844 8.13421 8.13275 9.7999 6.0651 9.7999C3.99746 9.7999 2.33177 8.13421 2.33177 6.06657C2.33177 3.99892 3.99746 2.33324 6.0651 2.33324Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  </div>
                  <Uploadbtn data={option} />
                </div>

                <div>
                  <Table className="border-separate border-spacing-y-4">
                    <TableBody>
                      {filteredFiles.length > 0 ? (
                        filteredFiles.map((file, index) => (
                          <div
                            key={index}
                            className="bg-[#D8D8D8] bg-opacity-20 flex justify-between mx-6 p-2 px-3 gap-10 mb-2 rounded-[18px] items-center text-current font-montserrat font-[#282828]"
                          >
                            <div className="flex gap-10 text-center items-center font-medium">
                              <div className="flex p-3 rounded-xl gap-4 items-center bg-[#E5E5E5]">
                                <svg
                                  width="13"
                                  height="16"
                                  viewBox="0 0 13 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M2.54453 0.5C1.62479 0.5 0.867188 1.26219 0.867188 2.1875V13.8125C0.867188 14.7378 1.62479 15.5 2.54453 15.5H11.1176C12.0374 15.5 12.795 14.7378 12.795 13.8125V5.9375C12.7949 5.78833 12.736 5.64527 12.6311 5.53979L12.6253 5.53394L7.78549 0.664795C7.68065 0.559306 7.53846 0.500029 7.39018 0.5H2.54453ZM2.54453 1.625H6.83107V4.8125C6.83107 5.73781 7.58867 6.5 8.50841 6.5H11.6767V13.8125C11.6767 14.1299 11.4331 14.375 11.1176 14.375H2.54453C2.229 14.375 1.98542 14.1299 1.98542 13.8125V2.1875C1.98542 1.87006 2.229 1.625 2.54453 1.625ZM7.9493 2.42041L10.8861 5.375H8.50841C8.19288 5.375 7.9493 5.12994 7.9493 4.8125V2.42041Z"
                                    fill="#484848"
                                  />
                                </svg>
                              </div>
                              {file.name}
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-10 h-10 rounded-full border bg-transparent shadow-none border-[#797979] border-opacity-30"
                                >
                                  <svg
                                    viewBox="0 0 8 8"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="min-w-[.6rem]"
                                  >
                                    <path
                                      d="M8 0.805714L7.19429 0L4 3.19429L0.805714 0L0 0.805714L3.19429 4L0 7.19429L0.805714 8L4 4.80571L7.19429 8L8 7.19429L4.80571 4L8 0.805714Z"
                                      fill="black"
                                    />
                                  </svg>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete your file
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      handleDeleteFile(file);
                                    }}
                                  >
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            No files available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ));

  return (
    <div className="pb-10">
      <div className="mb-4 flex justify-end">
        <div className="relative flex gap-2 bg-[#F5F6F1] rounded-full mx-6 p-1">
          <div
            className={`absolute top-0 bottom-0 left-0 w-1/2 bg-[#3E3E3E] bg-opacity-80 rounded-full transition-transform duration-300 ${list ? "translate-x-0" : "translate-x-full"
              }`}
          ></div>

          <div
            className={`flex-1 flex items-center justify-center gap-4 cursor-pointer rounded-full px-5 transition-colors duration-300 ${list ? "text-white" : "text-black"
              }`}
            onClick={() => handleViewModeChange(true)}
            style={{ flexBasis: "50%", zIndex: 1 }}
          >
            List <ListBulletIcon className="w-4 h-4" />
          </div>

          <div
            className={`flex-1 flex items-center justify-center gap-3 cursor-pointer rounded-full px-5 transition-colors duration-300 ${!list ? "text-white" : "text-black"
              }`}
            onClick={() => handleViewModeChange(false)}
            style={{ flexBasis: "50%", zIndex: 1 }}
          >
            Folder <DashboardIcon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex flex-row gap-3 self-end bg-[#F5F5F0] p-1 rounded-[40px] px-2">
          <Input
            placeholder="Filter name..."
            value={filterInput}
            onChange={(event) => setFilterInput(event.target.value)}
            className="shadow-none border-none"
          />

          <div className="bg-[#3E3E3E] rounded-full p-[.6rem] bg-opacity-80">
            <svg
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-white"
            >
              <path
                d="M6.0651 1.3999C3.49315 1.3999 1.39844 3.49461 1.39844 6.06657C1.39844 8.63852 3.49315 10.7332 6.0651 10.7332C7.18354 10.7332 8.21056 10.3361 9.01549 9.67685L11.8018 12.4632C11.8448 12.508 11.8963 12.5437 11.9533 12.5684C12.0103 12.593 12.0717 12.606 12.1337 12.6066C12.1958 12.6073 12.2574 12.5955 12.3149 12.572C12.3724 12.5486 12.4246 12.5139 12.4685 12.47C12.5124 12.4261 12.5471 12.3738 12.5706 12.3164C12.594 12.2589 12.6058 12.1973 12.6052 12.1352C12.6045 12.0731 12.5915 12.0118 12.5669 11.9548C12.5423 11.8978 12.5065 11.8463 12.4617 11.8033L9.67539 9.01696C10.3346 8.21203 10.7318 7.18501 10.7318 6.06657C10.7318 3.49461 8.63706 1.3999 6.0651 1.3999ZM6.0651 2.33324C8.13275 2.33324 9.79844 3.99892 9.79844 6.06657C9.79844 8.13421 8.13275 9.7999 6.0651 9.7999C3.99746 9.7999 2.33177 8.13421 2.33177 6.06657C2.33177 3.99892 3.99746 2.33324 6.0651 2.33324Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="mx-5 grid grid-cols-1 sm:grid-cols-2 2md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4  2xl:grid-cols-5 place-items-center gap-5 mt-5 font-montserrat">
        <Dialog>
          <DialogTrigger className="text-left">
            <div
              className={`flex flex-col p-5 rounded-[20px] gap-5 text-[#3B3B3B] max-w-[275px]  bg-[#FFC8C8] bg-opacity-60`}
              onClick={() => handleOpenCompanyBio()}
            >
              <div className="flex flex-row justify-between items-center">
                <div
                  className="w-[12px] h-[12px] mr-5 p-2 rounded-full h-[32px] w-[32px] bg-[#FFFFFF] bg-opacity-50 flex item-center justify-between"
                >
                  <Icons.ProfileCard className="" />
                </div>
                <div>
                  <Icons.Expand className="w-[12px] h-[12px] mr-5" />
                </div>
              </div>
              <div className="flex flex-col gap-[10px] font-medium font-montserrat">
                <div className="text-[14px] break-words leading-tight">
                  AAA
                </div>
                <div className="text-[10px] leading-tight">
                  All document relation general information on company details
                </div>
              </div>
            </div>
          </DialogTrigger>

          <DialogContent className="max-w-[80vw] max-h-[85vh] min-w-[80vw] min-h-[85vh] p-10 px-14 pb-8 font-montserrat pt-5 text-[#545454] py-9">
            {coreContextExists ? (
              <div className="p-6 space-y-6">
                <div className="flex justify-between">
                  <h2 className="text-2xl font-medium">Company Bio</h2>
                  <div className="flex gap-3 text-sm">
                    <button className="bg-[#D5D5D5] bg-opacity-25 rounded-full p-3 px-5">Uploaded Files</button>
                    <button className="bg-[#D5D5D5] bg-opacity-25 rounded-full p-3 px-5" onClick={() => { setCoreContextExists(false) }}>Regenerate</button>
                  </div>
                </div>
                <hr className="mt-5" />
                <div className="max-h-[55vh] overflow-y-auto scrollbar-hide space-y-3">
                  {Object.entries(companyBioData).map(([key, value]) => (
                    <div key={key} className="flex gap-8">
                      <div className="w-48 text-sm text-muted-foreground font-medium">
                        # {key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                      </div>
                      <div className="flex-1 text-sm">
                        {editingField === key ? (
                          Array.isArray(value) ? (
                            <div className="border border-gray-600 rounded-md p-1 scrollbar-hide">
                              <Textarea
                                value={value.length > 0 ? value.join(', ') : '--'}
                                onChange={(e) => handleInputChange(key, e.target.value.split(',').map((item) => item.trim()))}
                                onBlur={() => setEditingField(null)}
                                className="w-full rounded p-1 border-none outline-none shadow-none focus-visible:ring-transparent scrollbar-hide"
                                autoFocus
                              />
                            </div>
                          ) : (
                            <div className="border border-gray-600 rounded-md p-1 scrollbar-hide">
                              <Textarea
                                value={typeof value === 'string' ? value : '---'}
                                onChange={(e) => handleInputChange(key, e.target.value)}
                                onBlur={() => setEditingField(null)}
                                className="w-full rounded p-1 border-none outline-none shadow-none focus-visible:ring-transparent scrollbar-hide"
                                autoFocus
                              />
                            </div>
                          )
                        ) : (
                          <span onClick={() => setEditingField(key)} className="cursor-pointer">
                            {Array.isArray(value) ? (value.length > 0 ? value.join(', ') : '--') : (value || '--') as string}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button onClick={handleSave} className="bg-[#D5D5D5] bg-opacity-25 rounded-full p-2 px-5" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="font-medium text-2xl mb-5">Company Bio</div>
                <hr />
                <div className="p-6 sm:p-16 flex flex-col gap-4 sm:gap-5 items-center sm:px-28 mt-[4rem]">
                  <div className="flex items-center font-raleway text-xl font-medium gap flex justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span>Upload company bio documents</span>
                    </div>
                    <Uploadbtn data={"CompanyBio"} />
                  </div>

                  <div className="p-2 rounded-full font-medium text-sm bg-[#F5F4F4]">OR</div>

                  <div className="flex items-center font-raleway text-xl font-medium gap flex justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span>Generate Company bio</span>
                    </div>

                    <div className="flex max-w-xl items-center gap-2 rounded-full bg-[#F6F6F6] p-2 text-base">
                      <Input
                        type="text"
                        placeholder="www.amazon.com"
                        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                      />
                      <Button className="rounded-full bg-[#2D2D2D] px-6 hover:bg-[#1a1a1a]">
                        Generate
                      </Button>
                    </div>
                  </div>
                  <div className="p-2 rounded-full font-medium text-sm bg-[#F5F4F4]">OR</div>
                  <div className="flex items-center font-raleway text-xl font-medium gap flex justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span>Manually fill-up bio</span>
                    </div>
                    <div className="bg-[#F5F4F4] border-0 shadow-none p-3 rounded-full text-base px-8">
                      Answer Few Questions
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        {renderedFiletypes}
      </div>
    </div>
  );
};

export default FolderView;