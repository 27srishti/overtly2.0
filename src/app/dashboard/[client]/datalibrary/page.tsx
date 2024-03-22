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
import { MoreHorizontal } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { useParams } from 'next/navigation'

const FILES_PER_PAGE = 10;

const Page = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [fetchedFiles, setFetchedFiles] = useState<{ Filename: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { client } = useClientStore();
  const authUser = auth.currentUser;
  const params = useParams<{ client: string; }>()
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
            .then((snapshot) => getDownloadURL(snapshot.ref))
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
      if (authUser) {
        const projectsData = await fetchData();
        setFetchedFiles(projectsData);
      }
    });
    return () => unsubscribe();
  }, [authUser, currentPage,params.client]);

  const fetchData = async () => {
    if (!authUser?.uid) {
      return [];
    }

    try {
      const storageRef = ref(storage, `users/${authUser?.uid}/${params.client}`);
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

  // Pagination logic
  const totalPages = Math.ceil(fetchedFiles.length / FILES_PER_PAGE);
  const indexOfLastFile = currentPage * FILES_PER_PAGE;
  const indexOfFirstFile = indexOfLastFile - FILES_PER_PAGE;
  const currentFiles = fetchedFiles.slice(indexOfFirstFile, indexOfLastFile);

  return (
    <div className="w-full px-5 mt-4 ml-16 sm:ml-44">
      <div>
        <div className="text-3xl font-bold mt-4 lg:ml-32">Upload files</div>
        <div className="ml-2 lg:ml-32">
          {client?.name ? (
            `Client Name - ${client.name}`
          ) : (
            <Skeleton className="h-10 w-[100px]" />
          )}
        </div>

        <div className="flex flex-col items-center">
          <div className="flex justify-center mt-5 flex-col gap-4">
            <div className="bg-secondary rounded-md p-5 relative">
              <input
                ref={fileInputRef}
                className="absolute inset-0 z-50 w-full h-full p-0 m-0 cursor-pointer opacity-0"
                type="file"
                onChange={handleFileUpload}
                multiple
              />
              <div className="p-10 border-dashed border">
                {files.length > 0 ? (
                  files.map((file, index) => <div key={index}>{file.name}</div>)
                ) : (
                  <div>Drop the files you want to upload</div>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              className="flex gap-2"
              onClick={uploadFilesToFirebase}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  <div>Uploading</div>
                </>
              ) : (
                <>
                  <Icons.Upload />
                  <div>Upload the files</div>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-7">
        <div className="mx-auto overflow-hidden max-w-[70vw]">
          <div className="rounded-sm border">
            <div className="text-left align-middle font-sm text-muted-foreground grid grid-cols-4 self-center border-b p-4">
              <div className="col-span-3">File name</div>
              <div className="text-center">Actions</div>
            </div>
            {/* Render current page of fetched files */}
            {currentFiles.map((file, index) => (
              <div
                key={index}
                className={`h-10 text-left align-middle font-sm text-muted-foreground grid grid-cols-4 items-center align-middle ${
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
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="ml-10 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <div className="mr-10">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
