"use client";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/button";
import React, { ChangeEvent, useState, useRef } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "@/lib/firebase/firebase";
import { usePathname } from "next/navigation";
import clearCachesByServerAction from "./revalidate";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useClientStore } from "@/store";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Fileupload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { client } = useClientStore();
  const pathname = usePathname();
  const params = useParams();
  const clientid = params.client;
  const authUser = auth.currentUser;

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

  const uploadFilesToFirebase = () => {
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
          `${authUser?.uid}/${clientid}/${newFileName}`
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

      Promise.all(uploadPromises)
        .then((downloadURLs) => {
          console.log(
            "Files uploaded successfully! Download URLs:",
            downloadURLs
          );
          console.log(pathname);
          clearCachesByServerAction(pathname);
          setFiles([]);
        })
        .catch((error) => {
          console.error("Error uploading files:", error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      openFileUploadDialog();
    }
  };

  return (
    <div>
      <div className="text-3xl font-bold mt-4 lg:ml-32">Upload files</div>
      <div className="ml-2 lg:ml-32">
        {/* {client?.name ? (
          `Client Name - ${client.name}`
        ) : (
          <Skeleton className="h-10 w-[100px]" />
        )} */}
        <Breadcrumb className="mt-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/dashboard/${client?.id}`}>
                {" "}
                {client?.name ? (
                  client.name
                ) : (
                  <Skeleton className="h-10 w-[100px]" />
                )}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Library</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
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
              {files.length > 0
                ? files.map((file, index) => <div key={index}>{file.name}</div>)
                : "Drop the files you want to upload"}
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
  );
};

export default Fileupload;
