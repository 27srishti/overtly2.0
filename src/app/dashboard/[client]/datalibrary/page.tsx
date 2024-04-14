"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { auth, storage } from "@/lib/firebase/firebase";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
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

const FILES_PER_PAGE = 10;

const Page = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [fetchedFiles, setFetchedFiles] = useState<{ Filename: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { client } = useClientStore();
  const authUser = auth.currentUser;
  const params = useParams<{ client: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (newFiles && newFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(newFiles)]);
    }
  };

  const openFileUploadDialog = () => {
    // Trigger click on file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const uploadFilesToFirebase = async () => {
    if (files.length > 0 && authUser) {
      setLoading(true);
      const uploadPromises: Promise<string>[] = [];

      files.forEach((file) => {
        const originalFileName = file.name;
        const fileNameWithoutExtension = originalFileName.slice(0, 12);
        const fileExtension = originalFileName.slice(-5);

        const uniqueId = uuidv4();
        const newFileName = `${fileNameWithoutExtension}_${uniqueId}.${fileExtension}`;

        const storageRef = ref(
          storage,
          `users/${authUser?.uid}/${params.client}/${newFileName}`
        );
        uploadPromises.push(
          uploadBytes(storageRef, file)
            .then((snapshot) => {
              const filePath = snapshot.ref.fullPath;
              const bucketName = storageRef.bucket;
              console.log("File uploaded successfully:", filePath, bucketName);

              const url = `https://data-processing-dot-pr-ai-99.uc.r.appspot.com/process-file?bucket_name=${encodeURIComponent(
                bucketName
              )}&file_path=${encodeURIComponent(filePath)}`;

              // Make the POST request
              return fetch(url, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }).then((response) => response.json());
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
        setFiles([]);
      }
    } else {
      openFileUploadDialog();
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
      const storageRef = ref(
        storage,
        `users/${authUser?.uid}/${params.client}`
      );
      const res = await listAll(storageRef);
      const files = res.items.map((item) => item.name);
      console.log("Fetch successful:", files);
      return files.map((fileName) => ({
        Filename: fileName,
      }));
    } catch (error) {
      console.error("Error retrieving files:", error);
      return [];
    }
  };
////remove pr add to btn
  useEffect(() => {
    if (files.length > 0) {
      uploadFilesToFirebase();
    }
  }, [files]);

  const totalPages = Math.ceil(fetchedFiles.length / FILES_PER_PAGE);
  const indexOfLastFile = currentPage * FILES_PER_PAGE;
  const indexOfFirstFile = indexOfLastFile - FILES_PER_PAGE;
  const currentFiles = fetchedFiles.slice(indexOfFirstFile, indexOfLastFile);

  return (
    <div className="w-full px-16 mt-4 font-montserrat ">
      <div className="flex gap-16 mt-11 mb-14">
        <div className="text-3xl mt-4 ml-2 font-montserrat capitalize">
          {client?.name ? client.name : <Skeleton className="h-10 w-[100px]" />}
        </div>

        <Button
          className="mt-3 gap-7 b-0 shadow-none outline-none hover:bg-[#e8e8e8] transc p-6 rounded-2xl grey transition-all"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            className="absolute inset-0 z-[-1] opacity-0"
            type="file"
            onChange={handleFileUpload}
            multiple
          />
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
        </Button>
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
          <TabsContent value="account">
            <div className="mt-7">
              <div className="mx-auto overflow-hidden max-w-[70vw]">
                <div className="rounded-sm border">
                  <div className="text-left align-middle font-sm text-muted-foreground grid grid-cols-4 self-center border-b p-4">
                    <div className="col-span-3">File name</div>
                    <div className="text-center">Actions</div>
                  </div>

                  {currentFiles.map((file, index) => (
                    <div
                      key={index}
                      className={`h-10 text-left align-middle font-sm text-muted-foreground grid grid-cols-4 items-center  ${
                        index !== currentFiles.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <div className="col-span-3 line-clamp-1 px-3 over">
                        {file.Filename}
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
                            <DropdownMenuItem>Delete File</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
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
