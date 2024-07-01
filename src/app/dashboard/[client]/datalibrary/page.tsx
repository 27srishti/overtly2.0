"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { auth, db, storage } from "@/lib/firebase/firebase";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/ui/Icons";
import { useClientStore } from "@/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { onAuthStateChanged } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { database } from "firebase-admin";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DashboardIcon, DashIcon, ListBulletIcon } from "@radix-ui/react-icons";
import { Filetypes } from "@/lib/dropdown";

const FILES_PER_PAGE = 7;

interface FileCollection {
  id: string;
  url: string;
  name: string;
  type: string;
  createdAt: number;
  bucketName: string;
  filesCategory: string;
}

const Page = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [fetchedFiles, setFetchedFiles] = useState<FileCollection[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fakeProgress, setFakeProgress] = useState<number>(0);
  const [open, setOpen] = React.useState(false);
  const { client } = useClientStore();
  const authUser = auth.currentUser;
  const params = useParams<{ client: string }>();
  const [list, setlist] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFiles = fetchedFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFiles.length / FILES_PER_PAGE);

  const indexOfLastFile = currentPage * FILES_PER_PAGE;
  const indexOfFirstFile = indexOfLastFile - FILES_PER_PAGE;

  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);

  const handleFileClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const uploadFilesToFirebase = async () => {
    setUploadProgress(0);
    setFakeProgress(0);

    if (files.length > 0 && authUser) {
      setLoading(true);
      setIsUploading(true);
      const uploadPromises: Promise<string>[] = [];
      let uploadedCount = 0;

      const fakeProgressInterval = setInterval(() => {
        setFakeProgress((prev) => {
          const nextProgress = Math.min(prev + 5, 85);
          return nextProgress;
        });
      }, 150);

      files.forEach((file) => {
        const originalFileName = file.name;
        const fileNameWithoutExtension = originalFileName.split(".")[0];
        const uniqueId = uuidv4().slice(0, 6);
        const fileExtension = file.name.split(".").pop();

        const storageRef = ref(
          storage,
          `users/${authUser?.uid}/${params.client}/${fileNameWithoutExtension}_${uniqueId}.${fileExtension}`
        );

        uploadPromises.push(
          uploadBytes(storageRef, file)
            .then(async (snapshot) => {
              const filePath = snapshot.ref.fullPath;
              const bucketName = storageRef.bucket;
              console.log("File uploaded successfully:", filePath, bucketName);

              const fileUrl = await getDownloadURL(storageRef);

              const docRef = doc(
                db,
                `users/${authUser.uid}/clients/${params.client}/files`,
                uniqueId
              );

              const data = {
                url: fileUrl,
                name: originalFileName,
                bucketName: `${fileNameWithoutExtension}_${uniqueId}.${fileExtension}`,
                type: file.type,
                createdAt: Date.now(),
              };

              await setDoc(docRef, data);

              const url = `https://data-processing-dot-pr-ai-99.uc.r.appspot.com/process-file?bucket_name=${encodeURIComponent(
                bucketName
              )}&file_path=${encodeURIComponent(filePath)}`;

              return fetch(url, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }).then((response) => response.json());
            })
            .then((data) => {
              uploadedCount++;
              setUploadProgress((uploadedCount / files.length) * 100);
              return data;
            })
            .catch((error) => {
              console.error("Error uploading file:", error.message);
              return "";
            })
        );
      });

      try {
        await Promise.all(uploadPromises);
        const projectsData = await fetchData();
        setFetchedFiles(projectsData);
      } catch (error: any) {
        console.error("Error uploading files:", error);
      } finally {
        clearInterval(fakeProgressInterval);
        setLoading(false);
        setUploadProgress(0);
        setFakeProgress(0);
        setFiles([]);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser && params.client) {
        const projectsData = await fetchData();
        setFetchedFiles(projectsData);
      }
    });
    return () => unsubscribe();
  }, [authUser, currentPage, params.client]);

  const fetchData = async () => {
    if (!authUser?.uid) {
      return [];
    }

    try {
      const docRef = collection(
        db,
        `users/${authUser.uid}/clients/${params.client}/files`
      );
      const querySnapshot = await getDocs(docRef);
      const files = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        url: doc.data().url,
        name: doc.data().name,
        originalName: doc.data().originalName,
        type: doc.data().type,
        createdAt: doc.data().createdAt,
        bucketName: doc.data().bucketName,
        filesCategory: doc.data().filesCategory,
      }));
      console.log("Fetch successful:", files);
      return files;
    } catch (error) {
      console.error("Error retrieving files:", error);
      return [];
    }
  };

  useEffect(() => {
    if (files.length > 0) {
      uploadFilesToFirebase();
    }
  }, [files]);

  const handleDialogOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (file: {
    url: string;
    name: string;
    type: string;
    createdAt: number;
    bucketName: string;
  }) => {
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

        const url = `https://pr-ai-99.uc.r.appspot.com/file?client_id=${params.client}&user_id=${authUser?.uid}&file_name=${file.bucketName}`;

        return fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authUser?.getIdToken()}`,
          },
        })
          .then((response) => {
            console.log(response.json());
          })
          .catch((error) => console.error("Error:", error));
      }
    } catch (error) {
      console.error("Error deleting file metadata from Firestore:", error);
    } finally {
      const updatedFiles = await fetchData();
      setFetchedFiles(updatedFiles);
    }
  };

  const handleUpdateFile = async (file: FileCollection, value: string) => {
    if (!authUser?.uid) {
      console.error("User is not authenticated");
      return;
    }

    try {
      const docRef = doc(
        db,
        `users/${authUser.uid}/clients/${params.client}/files`,
        file.id
      );

      await updateDoc(docRef, {
        filesCategory: value,
      });

      const updatedFiles = await fetchData();
      setFetchedFiles(updatedFiles);
    } catch (error) {
      console.error("Error updating file metadata in Firestore:", error);
    }
  };

  return (
    <div className="w-full px-16 mt-4 font-montserrat">
      <div className="flex gap-16 mt-6 mb-10">
        <div className="text-[23px] mt-4  font-montserrat capitalize">
          {client?.name ? client.name : <Skeleton className="h-10 w-[100px]" />}
        </div>
      </div>
      <div>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-5 flex flex-row justify-between ml-3">
            <div className="flex gap-8">
              <TabsTrigger
                value="account"
                className="p-3 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#585858] bg-[#ECECEC]"
              >
                Documents
              </TabsTrigger>
              <TabsTrigger
                value="newsarticles"
                className="p-3 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#585858] bg-[#ECECEC]"
              >
                News Articles
              </TabsTrigger>
              <TabsTrigger
                value="knowledgegraph"
                className="p-3 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#585858] bg-[#ECECEC]"
              >
                Knowledge Graph
              </TabsTrigger>
              <TabsTrigger
                value="mediadatabase"
                className="p-3 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#585858] bg-[#ECECEC]"
              >
                Media Database
              </TabsTrigger>
            </div>
            <div>
              {" "}
              <Dialog open={open} onOpenChange={handleDialogOpenChange}>
                <DialogTrigger>
                  <div className="gap-7 b-0 shadow-none outline-none hover:bg-[#e8e8e8] transcition-all rounded-2xl grey transition-all flex items-center px-4 py-[.7rem]">
                    <div className="ml-1 font-montserrat text-[#545454]">
                      Upload files
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 0 24 24"
                      width="24px"
                      fill="#545454"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path
                        d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"
                        className="w-6 h-6"
                      />
                    </svg>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[900px] p-0">
                  <div className="flex items-center justify-center font-montserrat text-[#545454] p-10 py-10 flex-col gap-8">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                      multiple
                    />
                    {isUploading ? (
                      <div className="w-full items-center justify-center font-montserrat text-[#545454] flex-col gap-10 ">
                        <div className="text-xl font-medium">Upload Files</div>
                        <div className="rounded-lg flex flex-col items-center justify-center py-[5rem] cursor-pointer w-full border-spacing-[7px]">
                          <div className="text-gray-400 flex gap-3 mb-10 pt-8">
                            <svg
                              width="25"
                              height="31"
                              viewBox="0 0 25 31"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-6 h-6"
                            >
                              <path
                                d="M15.4154 0.916504H3.7487C2.14453 0.916504 0.846615 2.229 0.846615 3.83317L0.832031 27.1665C0.832031 28.7707 2.12995 30.0832 3.73411 30.0832H21.2487C22.8529 30.0832 24.1654 28.7707 24.1654 27.1665V9.6665L15.4154 0.916504ZM21.2487 27.1665H3.7487V3.83317H13.957V11.1248H21.2487V27.1665ZM6.66536 19.8894L8.72161 21.9457L11.0404 19.6415V25.7082H13.957V19.6415L16.2758 21.9603L18.332 19.8894L12.5133 14.0415L6.66536 19.8894Z"
                                fill="#545454"
                              />
                            </svg>
                            <div className="self-center text-[#545454]">
                              Uploading {files.length} files...
                            </div>
                          </div>
                          <div className="w-[90%] bg-[#E8E8E8] rounded-full">
                            <div
                              className="progressbar rounded-full p-[0.15rem]"
                              style={{
                                width: `${Math.max(
                                  fakeProgress,
                                  uploadProgress
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="w-full flex justify-center gap-4 mt-10">
                          <Button
                            className="mt-4 text-white px-6 py-2 rounded-[55px] flex items-center font-montserrat bg-[#5C5C5C]  font-sm  gap-4 font-light py-5"
                            onClick={handleFileClick}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-6"
                            >
                              <path
                                d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z"
                                fill="white"
                              />
                            </svg>
                            Choose more Files
                          </Button>
                          <Button
                            className="mt-4 text-white px-6 py-2 rounded-[55px] flex items-center font-montserrat bg-[#5C5C5C]  font-sm  gap-4 font-light py-5"
                            onClick={() => {
                              setOpen(false);
                            }}
                          >
                            Done
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-full items-center justify-center font-montserrat text-[#545454] flex-col px-4">
                          <div className="text-xl font-medium">
                            Upload Files
                          </div>
                          <div
                            className="mt-2 relative cursor-pointer mt-6"
                            onClick={handleFileClick}
                            onDrop={handleFileDrop}
                            onDragOver={(e) => e.preventDefault()}
                          >
                            <svg
                              width="100%"
                              height="272"
                              viewBox="0 0 893 272"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="0.5"
                                y="0.5"
                                width="892"
                                height="271"
                                rx="24.5"
                                stroke="#5B6FA4"
                                stroke-linecap="round"
                                stroke-dasharray="7 15"
                              />
                            </svg>
                            <div className="flex gap-3 font-medium font-montserrat text-lg absolute top-[47%] w-full text-center justify-center">
                              <svg
                                width="25"
                                height="31"
                                viewBox="0 0 25 31"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6"
                              >
                                <path
                                  d="M15.4154 0.916504H3.7487C2.14453 0.916504 0.846615 2.229 0.846615 3.83317L0.832031 27.1665C0.832031 28.7707 2.12995 30.0832 3.73411 30.0832H21.2487C22.8529 30.0832 24.1654 28.7707 24.1654 27.1665V9.6665L15.4154 0.916504ZM21.2487 27.1665H3.7487V3.83317H13.957V11.1248H21.2487V27.1665ZM6.66536 19.8894L8.72161 21.9457L11.0404 19.6415V25.7082H13.957V19.6415L16.2758 21.9603L18.332 19.8894L12.5133 14.0415L6.66536 19.8894Z"
                                  fill="#5C5C5E"
                                />
                              </svg>
                              Drag and drop files
                            </div>
                          </div>
                        </div>
                        <div>OR</div>

                        <div
                          onFocusCapture={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button className=" text-white px-6 py-2 rounded-[55px] flex items-center font-montserrat bg-[#5C5C5C]  font-sm  gap-4 font-light py-5">
                                  <svg
                                    width="22"
                                    height="20"
                                    viewBox="0 0 22 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-6"
                                  >
                                    <path
                                      d="M18.9997 19V16H21.9997V14H18.9997V11H16.9997V14H13.9997V16H16.9997V19H18.9997ZM14.0297 19.5H4.65974C3.93974 19.5 3.27974 19.12 2.92974 18.5L0.56974 14.4C0.20974 13.78 0.20974 13.05 0.56974 12.43L6.91974 1.5C7.26974 0.88 7.93974 0.5 8.64974 0.5H13.3497C14.0797 0.5 14.7197 0.88 15.0797 1.49L19.5597 9.2C19.0597 9.07 18.5397 9 17.9997 9C17.7197 9 17.4397 9.02 17.1597 9.06L13.3497 2.5H8.64974L2.30974 13.41L4.65974 17.5H12.5497C12.8997 18.27 13.3997 18.95 14.0297 19.5ZM12.3397 13C12.1197 13.63 11.9997 14.3 11.9997 15H6.24974L5.51974 13.73L10.0997 5.75H11.8997L14.4297 10.17C13.8697 10.59 13.3797 11.1 12.9897 11.68L10.9897 8.19L8.24974 13H12.3397Z"
                                      fill="white"
                                    />
                                  </svg>
                                  Upload From Drive
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-[#5C5C5C]">
                                <p>Comming soon</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </TabsList>
          <TabsContent
            value="account"
            className="px-0 bg-transparent border rounded-[30px]"
          >
            <div className="mx-auto overflow-hidden">
              <div className="flex flex-row p-2 w-full justify-end gap-5 mb-4 px-6">
                <div className="relative flex gap-2 bg-[#F5F6F1] rounded-full mx-6 p-1">
                  <div
                    className={`absolute top-0 bottom-0 left-0 w-1/2 bg-[#3E3E3E] bg-opacity-80 rounded-full transition-all duration-300 ${
                      list ? "translate-x-0" : "translate-x-full"
                    }`}
                    style={{ transition: "transform 0.3s" }}
                  ></div>

                  <div
                    className={`flex-1 flex items-center justify-center gap-4 cursor-pointer rounded-full px-5 transition-all duration-300 ${
                      list ? "text-white" : "text-black"
                    }`}
                    onClick={() => setlist(true)}
                    style={{ flexBasis: "50%", zIndex: 1 }}
                  >
                    List <ListBulletIcon className="w-4 h-4" />
                  </div>

                  <div
                    className={`flex-1 flex items-center justify-center gap-3 cursor-pointer rounded-full px-5 transition-all duration-300 ${
                      !list ? "text-white" : "text-black"
                    }`}
                    onClick={() => setlist(false)}
                    style={{ flexBasis: "50%", zIndex: 1 }}
                  >
                    Folder <DashboardIcon className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex flex-row gap-3 self-end bg-[#F5F5F0] p-1 rounded-[40px] px-2">
                  <Input
                    type="search"
                    placeholder="Search Data"
                    className="shadow-none border-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <div className="bg-[#3E3E3E] rounded-full rounded-full p-[.6rem] bg-opacity-80">
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
              {list ? (
                <>
                  {currentFiles.length === 0 ? (
                    <div className="text-muted-foreground text-center p-4">
                      No data
                    </div>
                  ) : (
                    currentFiles.map((file, index) => (
                      <div
                        key={index}
                        className="bg-[#D8D8D8] bg-opacity-20 bg-opacity-[20%] flex justify-between mx-6 p-2 px-3 gap-10 mb-2 rounded-[18px] items-center text-current font-montserrat font-[#282828] "
                      >
                        <div className="flex gap-10 text-center items-center font-medium ">
                          <div className="flex p-3 rounded-xl gap-4 items-center bg-[#E5E5E5] ">
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

                        <div className="flex gap-28 flex-row">
                          <Select
                            defaultValue={file.filesCategory}
                            onValueChange={(value) =>
                              handleUpdateFile(file, value)
                            }
                          >
                            <SelectTrigger className="px-5 w-[250px] bg-white border-none shadow-none rounded-[40px] text-center font-medium bg-opacity-60">
                              <SelectValue placeholder="Select an category" />
                            </SelectTrigger>
                            <SelectContent>
                              {Filetypes.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                  className="font-montserrat"
                                >
                                  {option.value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
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
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleDeleteFile(file)}
                              >
                                Delete File
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  )}

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <span className="ml-10 text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <div className="mr-10">
                        <Button
                          variant="ghost"
                          onClick={() =>
                            setCurrentPage((prevPage) => prevPage - 1)
                          }
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>

                        <Button
                          variant="ghost"
                          onClick={() =>
                            setCurrentPage((prevPage) => prevPage + 1)
                          }
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="mx-10 grid grid-cols-4 gap-5 mt-5 font-montserrat">
                  {Filetypes.map((option) => (
                    <Dialog key={option.value}>
                      <DialogTrigger className="text-left">
                        <div
                          className={`flex flex-col  p-5 rounded-[35px] gap-5  text-[#3B3B3B] max-w-[275px] aspect-w-4 aspect-h-3  ${option.color}`}
                          key={option.value}
                        >
                          <div
                            className={`flex flex-row justify-between items-center `}
                          >
                            <span
                              className={`p-2 rounded-full  h-[32px] w-[32px] ${option.colorwheel}`}
                            ></span>
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
                      <DialogContent>{option.value}</DialogContent>
                    </Dialog>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent
            value="newsarticles"
            className="px-0 bg-transparent border rounded-[30px]"
          >
            <div className="mx-auto overflow-hidden">
              <div className="flex flex-row p-2 w-full justify-end px-10">
                <div className="flex flex-row gap-3 self-end bg-[#F5F5F0] p-1 rounded-[40px] px-2">
                  <Input
                    type="search"
                    placeholder="Search Data"
                    className="shadow-none border-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <div className="bg-[#3E3E3E] rounded-full rounded-full p-[.6rem] bg-opacity-80">
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
              <div className="flex flex-col gap-4 mt-5">
                <div className="bg-[#D8D8D8] bg-opacity-20 flex mx-12 flex gap-6 p-2 rounded-2xl">
                  <img src="/placeholder.png"></img>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row justify-between pr-10">
                      <div className="font-semibold mt-2">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Dolore, impedit.
                      </div>

                      <div className="flex gap-2 items-center text-[.8rem] text-center">
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 17 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_1455_2103)">
                            <path
                              d="M8.49422 1.4165C4.58422 1.4165 1.41797 4.58984 1.41797 8.49984C1.41797 12.4098 4.58422 15.5832 8.49422 15.5832C12.4113 15.5832 15.5846 12.4098 15.5846 8.49984C15.5846 4.58984 12.4113 1.4165 8.49422 1.4165ZM8.5013 14.1665C5.37047 14.1665 2.83464 11.6307 2.83464 8.49984C2.83464 5.369 5.37047 2.83317 8.5013 2.83317C11.6321 2.83317 14.168 5.369 14.168 8.49984C14.168 11.6307 11.6321 14.1665 8.5013 14.1665Z"
                              fill="#858383"
                            />
                            <path
                              d="M8.85547 4.9585H7.79297V9.2085L11.5117 11.4397L12.043 10.5685L8.85547 8.67725V4.9585Z"
                              fill="#858383"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_1455_2103">
                              <rect width="17" height="17" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        10 hours back
                      </div>
                    </div>
                    <div>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Dolore, impedit. Lorem ipsum dolor sit, amet consectetur
                      adipisicing elit. Cum, eaque quis. ue quis ue quis
                      Quisquam eaque velit tenetur sed aliquid, alias impedit
                      pariatur enim. Repellat minus necessitatibus voluptatem
                      unde, delectus neque tempora voluptate!
                    </div>
                  </div>
                </div>
                <div className="bg-[#D8D8D8] bg-opacity-20 flex mx-12 flex gap-6 p-2 rounded-2xl">
                  <img src="/placeholder.png"></img>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row justify-between pr-10">
                      <div className="font-semibold mt-2">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Dolore, impedit.
                      </div>

                      <div className="flex gap-2 items-center text-[.8rem]">
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 17 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_1455_2103)">
                            <path
                              d="M8.49422 1.4165C4.58422 1.4165 1.41797 4.58984 1.41797 8.49984C1.41797 12.4098 4.58422 15.5832 8.49422 15.5832C12.4113 15.5832 15.5846 12.4098 15.5846 8.49984C15.5846 4.58984 12.4113 1.4165 8.49422 1.4165ZM8.5013 14.1665C5.37047 14.1665 2.83464 11.6307 2.83464 8.49984C2.83464 5.369 5.37047 2.83317 8.5013 2.83317C11.6321 2.83317 14.168 5.369 14.168 8.49984C14.168 11.6307 11.6321 14.1665 8.5013 14.1665Z"
                              fill="#858383"
                            />
                            <path
                              d="M8.85547 4.9585H7.79297V9.2085L11.5117 11.4397L12.043 10.5685L8.85547 8.67725V4.9585Z"
                              fill="#858383"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_1455_2103">
                              <rect width="17" height="17" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        10 hours back
                      </div>
                    </div>
                    <div>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Dolore, impedit. Lorem ipsum dolor sit, amet consectetur
                      adipisicing elit. Cum, eaque quis. ue quis ue quis
                      Quisquam eaque velit tenetur sed aliquid, alias impedit
                      pariatur enim. Repellat minus necessitatibus voluptatem
                      unde, delectus neque tempora voluptate!
                    </div>
                  </div>
                </div>

                <div className="bg-[#D8D8D8] bg-opacity-20 flex mx-12 flex gap-6 p-2 rounded-2xl">
                  <img src="/placeholder.png"></img>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row justify-between pr-10">
                      <div className="font-semibold mt-2">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Dolore, impedit.
                      </div>

                      <div className="flex gap-2 items-center text-[.8rem]">
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 17 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_1455_2103)">
                            <path
                              d="M8.49422 1.4165C4.58422 1.4165 1.41797 4.58984 1.41797 8.49984C1.41797 12.4098 4.58422 15.5832 8.49422 15.5832C12.4113 15.5832 15.5846 12.4098 15.5846 8.49984C15.5846 4.58984 12.4113 1.4165 8.49422 1.4165ZM8.5013 14.1665C5.37047 14.1665 2.83464 11.6307 2.83464 8.49984C2.83464 5.369 5.37047 2.83317 8.5013 2.83317C11.6321 2.83317 14.168 5.369 14.168 8.49984C14.168 11.6307 11.6321 14.1665 8.5013 14.1665Z"
                              fill="#858383"
                            />
                            <path
                              d="M8.85547 4.9585H7.79297V9.2085L11.5117 11.4397L12.043 10.5685L8.85547 8.67725V4.9585Z"
                              fill="#858383"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_1455_2103">
                              <rect width="17" height="17" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        10 hours back
                      </div>
                    </div>
                    <div>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Dolore, impedit. Lorem ipsum dolor sit, amet consectetur
                      adipisicing elit. Cum, eaque quis. ue quis ue quis
                      Quisquam eaque velit tenetur sed aliquid, alias impedit
                      pariatur enim. Repellat minus necessitatibus voluptatem
                      unde, delectus neque tempora voluptate!
                    </div>
                  </div>
                </div>
                <div className="bg-[#D8D8D8] bg-opacity-20 flex mx-12 flex gap-6 p-2 rounded-2xl">
                  <img src="/placeholder.png"></img>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row justify-between pr-10">
                      <div className="font-semibold mt-2">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Dolore, impedit.
                      </div>

                      <div className="flex gap-2 items-center text-[.8rem]">
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 17 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_1455_2103)">
                            <path
                              d="M8.49422 1.4165C4.58422 1.4165 1.41797 4.58984 1.41797 8.49984C1.41797 12.4098 4.58422 15.5832 8.49422 15.5832C12.4113 15.5832 15.5846 12.4098 15.5846 8.49984C15.5846 4.58984 12.4113 1.4165 8.49422 1.4165ZM8.5013 14.1665C5.37047 14.1665 2.83464 11.6307 2.83464 8.49984C2.83464 5.369 5.37047 2.83317 8.5013 2.83317C11.6321 2.83317 14.168 5.369 14.168 8.49984C14.168 11.6307 11.6321 14.1665 8.5013 14.1665Z"
                              fill="#858383"
                            />
                            <path
                              d="M8.85547 4.9585H7.79297V9.2085L11.5117 11.4397L12.043 10.5685L8.85547 8.67725V4.9585Z"
                              fill="#858383"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_1455_2103">
                              <rect width="17" height="17" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        10 hours back
                      </div>
                    </div>
                    <div>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Dolore, impedit. Lorem ipsum dolor sit, amet consectetur
                      adipisicing elit. Cum, eaque quis. ue quis ue quis
                      Quisquam eaque velit tenetur sed aliquid, alias impedit
                      pariatur enim. Repellat minus necessitatibus voluptatem
                      unde, delectus neque tempora voluptate!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="knowledgegraph"> knowledge graph</TabsContent>
          <TabsContent value="mediadatabase">media database</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
