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
import { MoreHorizontal } from "lucide-react";
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
} from "firebase/firestore";

const FILES_PER_PAGE = 10;

const Page = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [fetchedFiles, setFetchedFiles] = useState<
    {
      url: string;
      name: string;
      type: string;
      createdAt: number;
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [open, setOpen] = React.useState(false);
  const { client } = useClientStore();
  const authUser = auth.currentUser;
  const params = useParams<{ client: string }>();

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (files.length > 0 && authUser) {
      setLoading(true);
      setIsUploading(true);
      const uploadPromises: Promise<string>[] = [];
      let uploadedCount = 0;

      files.forEach((file) => {
        const originalFileName = file.name;

        const uniqueId = uuidv4();

        const storageRef = ref(
          storage,
          `users/${authUser?.uid}/${params.client}/${uniqueId}`
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
                type: file.type,
                createdAt: Date.now(),
              };

              setDoc(docRef, data);

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
        setLoading(false);
        setUploadProgress(0);
        // setIsUploading(false);
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
      const files = querySnapshot.docs.map((doc) => doc.data());
      console.log("Fetch successful:", files);
      return files.map((file) => ({
        url: file.url,
        name: file.name,
        originalName: file.originalName,
        type: file.type,
        createdAt: file.createdAt,
      }));
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

  const totalPages = Math.ceil(fetchedFiles.length / FILES_PER_PAGE);
  const indexOfLastFile = currentPage * FILES_PER_PAGE;
  const indexOfFirstFile = indexOfLastFile - FILES_PER_PAGE;
  const currentFiles = fetchedFiles.slice(indexOfFirstFile, indexOfLastFile);

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
      }
    } catch (error) {
      console.error("Error deleting file metadata from Firestore:", error);
    }

    const updatedFiles = await fetchData();
    setFetchedFiles(updatedFiles);
  };

  return (
    <div className="w-full px-16 mt-4 font-montserrat">
      <div className="flex gap-16 mt-11 mb-14">
        <div className="text-3xl mt-4  font-montserrat capitalize">
          {client?.name ? client.name : <Skeleton className="h-10 w-[100px]" />}
        </div>
        <Dialog open={open} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger>
            <div className="mt-3 gap-7 b-0 shadow-none outline-none hover:bg-[#e8e8e8] transcition-all rounded-2xl grey transition-all flex items-center px-4 py-[.8rem]">
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
            <div className="flex items-center justify-center font-montserrat text-[#545454] p-10 py-10 flex-col gap-10">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                multiple
              />
              {isUploading ? (
                <div className="w-full items-center justify-center font-montserrat text-[#545454] flex-col gap-10 ">
                  <div className="text-3xl font-medium mb-10 self-center">
                    Upload Files
                  </div>
                  <div className="rounded-lg flex flex-col items-center justify-center py-[5rem] cursor-pointer w-full border-spacing-[7px]">
                    <div className="text-gray-400 flex gap-3 mb-10">
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
                      <div className="self-center">
                        Uploading {files.length} files...
                      </div>
                    </div>
                    <div className="w-full bg-[#E8E8E8]  rounded-full">
                      <div
                        className="progressbar rounded-full  p-[0.15rem]"
                        style={{ width: `${uploadProgress}%` }}
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
                  <div className="w-full items-center justify-center font-montserrat text-[#545454] flex-col gap-10 px-10">
                    <div className="text-xl font-medium mb-10">
                      Upload Files
                    </div>
                    <div
                      className="mt-2 relative cursor-pointer"
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
                      <div className="flex gap-3 font-medium font-montserrat text-lg absolute top-[50%] w-full text-center justify-center">
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

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="mt-4 text-white px-6 py-2 rounded-[55px] flex items-center font-montserrat bg-[#5C5C5C]  font-sm  gap-4 font-light py-5"
                          // onClick={handleFileClick}
                        >
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
                      <TooltipContent sideOffset={5} className="bg-[#5C5C5C]">
                        <div>Comming soon</div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="px-[10vw]">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="flex justify-start items-center ml-12">
            <TabsTrigger value="account" className="px-20 pt-4 mr-5 pb-3">
              Uploaded
            </TabsTrigger>
            <TabsTrigger value="password" className="px-20 pt-4 mr-5 pb-3">
              Web Extracted
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="px-0">
            <div className="mt-7">
              <div className="mx-auto overflow-hidden max-w-[80vw]">
                <div className="rounded-sm border-y">
                  <div className="text-left align-middle font-sm text-muted-foreground grid grid-cols-4 self-center border-b p-4">
                    <div className="col-span-3 ml-20">File name</div>
                    <div className="text-center">Actions</div>
                  </div>
                  {currentFiles.length === 0 ? (
                    <div className="text-muted-foreground text-center p-4">
                      No data
                    </div>
                  ) : (
                    currentFiles.map((file, index) => (
                      <div
                        key={index}
                        className={`h-10 text-left align-middle font-sm text-muted-foreground grid grid-cols-4 items-center  ${
                          index !== currentFiles.length - 1 ? "border-b" : ""
                        }`}
                      >
                        <div className="col-span-3 line-clamp-1 px-3 over  ml-4">
                          {file.name}
                        </div>
                        <div className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
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
                </div>

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
              </div>
            </div>
          </TabsContent>
          <TabsContent value="password">Web extracted Stuff here</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
