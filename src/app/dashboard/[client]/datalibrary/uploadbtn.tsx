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
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import clearCachesByServerAction from "@/lib/revalidation";
import useDrivePicker from "react-google-drive-picker";
import { logErrorToFirestore } from "@/lib/firebase/logs";

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
  const [DownloadfromDriven, setDownloadfromDrive] = useState<null | number>(
    null
  );
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

  const [openPicker, authResponse] = useDrivePicker();

  const { access_token } = authResponse || {};

  let token = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (access_token !== undefined) {
      token.current = access_token;
    }
  }, [access_token]);

  const handleOpenPicker = () => {
    setOpen(false);

    if (
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
      process.env.NEXT_PUBLIC_GOOGLE_API_KEY
    ) {
      openPicker({
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        developerKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
        viewId: "DOCS",
        showUploadView: true,
        showUploadFolders: true,
        supportDrives: true,
        multiselect: true,
        callbackFunction: async (data) => {
          if (data.action === "picked") {
            const driveFiles = data.docs.map((doc) => ({
              id: doc.id,
              name: doc.name,
              mimeType: doc.mimeType,
            }));
            await downloadAndUploadFiles(driveFiles);
          } else if (data.action === "cancel") {
            setOpen(true);
            console.log("User clicked cancel/close button");
          }
        },
      });
    }
  };

  const downloadAndUploadFiles = async (
    driveFiles: { id: string; name: string; mimeType: string }[]
  ) => {
    setDownloadfromDrive(driveFiles.length);
    setLoading(true);
    setOpen(true);
    setIsUploading(true);

    setUploadProgress(0);
    setFakeProgress(0);
    let uploadedCount = 0;
    const uploadPromises = driveFiles.map(async (file) => {
      const fileBlob = await downloadFileFromDrive(file.id, file.mimeType);
      if (fileBlob) {
        return uploadFileToFirebase(fileBlob, file.name);
      }
    });

    const fakeProgressInterval = setInterval(() => {
      setFakeProgress((prev) => {
        const nextProgress = Math.min(prev + 5, 85);
        return nextProgress;
      });
    }, 150);

    try {
      await Promise.all(uploadPromises).then((data) => {
        uploadedCount++;
        setUploadProgress((uploadedCount / files.length) * 100);
        return data;
      });
      clearCachesByServerAction(pathname);
    } catch (error: any) {
      console.error("Error uploading files:", error);
    } finally {
      setDownloadfromDrive(null);
      setLoading(false);
      setIsUploading(false);
      setFiles([]);
      clearInterval(fakeProgressInterval);
      setUploadProgress(0);
      setFakeProgress(0);
    }
  };

  const downloadFileFromDrive = async (fileId: string, mimeType: string) => {
    try {
      let url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

      const fileMetadataResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?fields=mimeType,name`,
        {
          headers: {
            Authorization: `Bearer ${token.current}`,
          },
        }
      );
      console.log(fileMetadataResponse);

      if (!fileMetadataResponse.ok) {
        throw new Error(
          `Failed to retrieve file metadata. Status: ${fileMetadataResponse.status}`
        );
      }

      const fileMetadata = await fileMetadataResponse.json();

      const isGoogleDocsFile = fileMetadata.mimeType.startsWith(
        "application/vnd.google-apps."
      );

      if (isGoogleDocsFile) {
        url = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=application/pdf`;
      }
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token.current}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to download file from Drive. Status: ${response.status}`
        );
      }

      return await response.blob();
    } catch (error) {
      console.error("Error downloading or exporting file:", error);
      return null;
    }
  };

  const uploadFileToFirebase = async (
    fileBlob: Blob,
    originalFileName: string
  ) => {
    if (!authUser) {
      console.error("User is not authenticated");
      return;
    }

    const fileNameWithoutExtension = originalFileName.split(".")[0];
    const uniqueId = uuidv4().slice(0, 6);
    const fileExtension = originalFileName.split(".").pop();

    const storageRef = ref(
      storage,
      `users/${authUser?.uid}/${params.client}/${fileNameWithoutExtension}_${uniqueId}.${fileExtension}`
    );

    try {
      const snapshot = await uploadBytes(storageRef, fileBlob);
      const filePath = snapshot.ref.fullPath;
      const bucketName = storageRef.bucket;

      const fileUrl = await getDownloadURL(storageRef);

      const docRef = doc(
        db,
        `users/${authUser.uid}/clients/${params.client}/files`,
        uniqueId
      );

      console.log(`users/${authUser.uid}/clients/${params.client}/files`);

      const data = {
        url: fileUrl,
        name: originalFileName,
        bucketName: `${fileNameWithoutExtension}_${uniqueId}.${fileExtension}`,
        type: fileBlob.type,
        createdAt: Date.now(),
        size: fileBlob.size,
      };

      await setDoc(docRef, data);

      const url = `https://data-extractor-87008435117.us-central1.run.app/process-file`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await authUser?.getIdToken()}`,
        },
        body: JSON.stringify({
          client_id: params.client,
          bucket_name: bucketName,
          file_path: filePath,
        }),
      });

      return response.json();
    } catch (error: any) {
      console.error("Error uploading file:", error);
      await logErrorToFirestore(
        authUser.uid,
        params.client,
        "process-file",
        error
      ); // Log the error
    }
  };

  const tab = searchParams.get("tab");

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
                size: file.size,
              };

              await setDoc(docRef, data);

              const url = `https://data-extractor-87008435117.us-central1.run.app/process-file`;

              if (tab === "mediadatabase") {
                return fetch(url, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${await authUser?.getIdToken()}`,
                  },
                  body: JSON.stringify({
                    client_id: params.client,
                    bucket_name: bucketName,
                    file_path: filePath,
                    file_type: "media_db",
                  }),
                }).then((response) => response.json());
              } else {
                return fetch(url, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${await authUser?.getIdToken()}`,
                  },
                  body: JSON.stringify({
                    client_id: params.client,
                    bucket_name: bucketName,
                    file_path: filePath,
                    file_type: "document",
                  }),
                }).then((response) => response.json());
              }
            })
            .then((data) => {
              uploadedCount++;
              setUploadProgress((uploadedCount / files.length) * 100);
              return data;
            })
            .catch(async (error) => {
              console.error("Error uploading file:", error.message);
              await logErrorToFirestore(
                authUser.uid,
                params.client,
                "process-file",
                error.message
              ); // Log the error

              await deleteObject(storageRef).catch((deleteError) => {
                console.error("Error deleting file from storage:", deleteError);
              });
              // Remove the document from Firestore
              await deleteDoc(
                doc(
                  db,
                  `users/${authUser.uid}/clients/${params.client}/files`,
                  uniqueId
                )
              ).catch((deleteError) => {
                console.error(
                  "Error deleting document from Firestore:",
                  deleteError
                );
              });

              // Inform the user about the error
              alert("File uploaded, but processing failed: " + error.message);
            })
        );
      });

      try {
        await Promise.all(uploadPromises);
        clearCachesByServerAction(pathname);
      } catch (error: any) {
        console.error("Error uploading files:", error);
        await logErrorToFirestore(
          authUser.uid,
          params.client,
          "process-file",
          error.message
        ); // Log the error
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
                    <div className="self-center text-[#545454]">
                      Uploading {files.length || DownloadfromDriven} files...
                    </div>
                  </div>
                  <div className="w-[90%] bg-[#E8E8E8] rounded-full">
                    <div
                      className="progressbar rounded-full p-[0.15rem]"
                      style={{
                        width: `${Math.max(fakeProgress, uploadProgress)}%`,
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
                      <path d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" fill="white" />
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
                  <div className="text-xl font-medium">Upload Files</div>
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
                        strokeLinecap="round"
                        strokeDasharray="7 15"
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
                        <Button
                          className=" text-white px-6 py-2 rounded-[55px] flex items-center font-montserrat bg-[#5C5C5C]  font-sm  gap-4 font-light py-5"
                          onClick={() => handleOpenPicker()}
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
    </>
  );
};

export default Uploadbtn;
