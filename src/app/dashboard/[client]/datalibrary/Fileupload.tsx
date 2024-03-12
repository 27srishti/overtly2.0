"use client";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/button";
import React, { ChangeEvent, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "@/lib/firebase/firebase";
import { usePathname } from "next/navigation";
import clearCachesByServerAction from "./revalidate";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const Fileupload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const pathname = usePathname();
  const params = useParams();
  const clientid = params.client;
  const authUser = auth.currentUser;

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
    }
  };

  const uploadFileToFirebase = () => {
    if (file && authUser) {
      setLoading(true);
      const originalFileName = file.name;
      const fileNameWithoutExtension = originalFileName.slice(0, 12);
      const fileExtension = originalFileName.slice(-5);

      const uniqueId = uuidv4();
      const newFileName = `${fileNameWithoutExtension}_${uniqueId}.${fileExtension}`;

      const storageRef = ref(
        storage,
        `${authUser?.uid}/${clientid}/${newFileName}`
      );
      uploadBytes(storageRef, file)
        .then((snapshot) => getDownloadURL(snapshot.ref))
        .then((downloadURL) => {
          console.log("File uploaded successfully! Download URL:", downloadURL);
          console.log(pathname)
          clearCachesByServerAction(pathname);
          setFile(null);
        })
        .catch((error) => {
          console.error("Error uploading file:", error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.error("No file selected!");
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="flex justify-center mt-5 flex-col gap-4">
          <div className="bg-secondary rounded-md p-5 relative">
            <input
              className="absolute inset-0 z-50 w-full h-full p-0 m-0 cursor-pointer opacity-0"
              type="file"
              onChange={handleFileUpload}
            />
            <div className="p-10 border-dashed border">
              {file ? file.name : "Drop the file you want to upload"}
            </div>
          </div>

          <Button
            variant="outline"
            className="flex gap-2"
            onClick={uploadFileToFirebase}
            disabled={loading}
          >
            <Icons.Upload />
            <div> Upload the files</div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Fileupload;
