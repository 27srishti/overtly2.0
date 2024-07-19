"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { auth, db, storage } from "@/lib/firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import clearCachesByServerAction from "@/lib/revalidation";

interface FileCollection {
  id: string;
  url: string;
  name: string;
  type: string;
  createdAt: number;
  bucketName: string;
  filesCategory: string;
}

const Uploadbtn = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [fetchedFiles, setFetchedFiles] = useState<FileCollection[]>([]);
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const authUser = auth.currentUser;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fakeProgress, setFakeProgress] = useState<number>(0);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const params = useParams<{ client: string }>();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab");

  console.log("tab", tab);
  const handleDialogOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (files.length > 0) {
      uploadFilesToFirebase();
    }
  }, [files]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

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

              const url = `https://data-processing-dot-pr-ai-99.uc.r.appspot.com/process-file`;

              const body = {
                client_id: params.client,
                bucket_name: bucketName,
                file_path: filePath,
              };

              if (tab === "mediadatabase") {
                body.file_type = tab;
              }

              return fetch(url, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${await authUser?.getIdToken()}`,
                },
                body: JSON.stringify(body),
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
        clearCachesByServerAction(pathname);
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

  return (
    <>
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
                    <div className="text-[#545454]">Uploading...</div>
                  </div>
                  <div className="w-[90%] h-[15px] bg-[#d9d9d9] rounded-full mt-8">
                    <div
                      className="h-full bg-gradient-to-r from-[#01787c] to-[#f8ff33] rounded-full"
                      style={{
                        width: `${Math.max(uploadProgress, fakeProgress)}%`,
                        transition: "width 0.5s",
                      }}
                    ></div>
                  </div>
                  <div className="mt-4 font-montserrat">
                    {uploadProgress}% uploaded
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="text-3xl font-medium">Upload Files</div>
                <div
                  onClick={handleFileClick}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  className="rounded-lg flex flex-col items-center justify-center py-[5rem] cursor-pointer w-full border-spacing-[7px] border-dashed border-[#979797]"
                >
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
                    <div className="text-[#545454]">Select files to upload</div>
                  </div>
                  <Button>Select files</Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Uploadbtn;
                
