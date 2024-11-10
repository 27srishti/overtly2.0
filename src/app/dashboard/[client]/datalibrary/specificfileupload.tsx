"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { auth, db, drive, storage } from "@/lib/firebase/firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import clearCachesByServerAction from "@/lib/revalidation";
import useDrivePicker from "react-google-drive-picker";
import { logErrorToFirestore } from "@/lib/firebase/logs";
import { canOpenDropbox } from "react-cloud-chooser";



const Uploadbtn = (props: { data: any }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [DownloadfromDriven, setDownloadfromDrive] = useState<null | number>(
    null
  );
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

  const handleOpenPicker = async () => {
    setOpen(false);

    try {
      if (drive.GOOGLE_CLIENT_ID && drive.GOOGLE_API_KEY) {
        openPicker({
          clientId: drive.GOOGLE_CLIENT_ID,
          developerKey: drive.GOOGLE_API_KEY,
          viewId: "DOCS",
          showUploadView: true,
          showUploadFolders: true,
          supportDrives: true,
          multiselect: true,
          callbackFunction: async (data) => {
            try {
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
            } catch (error) {
              console.error("Error during file processing:", error);
              setOpen(true); // Reopen picker in case of error
              alert("An error occurred while processing the selected files.");
            }
          },
        });
      } else {
        throw new Error(
          "Google Client ID and API Key are required but not provided."
        );
      }
    } catch (error) {
      console.error("Error opening Google Picker:", error);
      alert(
        "An error occurred while opening the Google Picker. Please try again later."
      );
      setOpen(true);
    }
  };

  interface DtopboxBtnProps {
    openDropbox: () => void;
    isDropboxLoading: boolean;
  }

  const DtopboxBtn: React.FC<DtopboxBtnProps> = ({
    openDropbox,
    isDropboxLoading,
  }) => (
    <Button
      onClick={openDropbox}
      className="flex items-center justify-center w-12 h-12 rounded-full bg-[#5C5C5C] text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="150"
        height="100"
        viewBox="0 0 50 50"
        fill="white"
      >
        <path d="M 15.5 1 C 15.34375 1.015625 15.195313 1.070313 15.0625 1.15625 L 0.46875 10.5625 C 0.199219 10.738281 0.03125 11.035156 0.0195313 11.359375 C 0.0078125 11.679688 0.152344 11.988281 0.40625 12.1875 L 9.34375 18.96875 L 0.40625 25.6875 C 0.128906 25.886719 -0.03125 26.214844 -0.0117188 26.558594 C 0.0078125 26.898438 0.199219 27.207031 0.5 27.375 L 9 32.375 L 9 39.09375 C 8.996094 39.429688 9.160156 39.746094 9.4375 39.9375 L 24.4375 49.84375 C 24.777344 50.074219 25.222656 50.074219 25.5625 49.84375 L 40.5625 40.03125 C 40.839844 39.839844 41.003906 39.523438 41 39.1875 L 41 32.4375 L 49.5 27.34375 C 49.769531 27.179688 49.945313 26.898438 49.976563 26.585938 C 50.007813 26.273438 49.890625 25.960938 49.65625 25.75 L 41.25 18.625 L 49.625 11.78125 C 49.875 11.578125 50.015625 11.265625 49.996094 10.945313 C 49.976563 10.621094 49.804688 10.328125 49.53125 10.15625 L 35.34375 1.15625 C 35.140625 1.023438 34.898438 0.96875 34.65625 1 C 34.472656 1.023438 34.300781 1.101563 34.15625 1.21875 L 25.03125 8.8125 L 16.25 1.25 C 16.046875 1.066406 15.773438 0.976563 15.5 1 Z M 15.53125 3.25 L 23.34375 9.96875 L 11.03125 17.78125 L 2.75 11.46875 Z M 34.875 3.25 L 47.28125 11.09375 L 39.59375 17.375 L 26.75 9.9375 Z M 25 11.28125 L 37.75 18.625 L 24.96875 26.625 L 12.875 19 Z M 39.59375 19.8125 L 47.3125 26.375 L 39.6875 30.9375 L 39.59375 30.96875 C 39.503906 31.007813 39.417969 31.0625 39.34375 31.125 L 34.6875 33.90625 L 26.75 27.875 Z M 11.0625 20.21875 L 23.25 27.875 L 15.53125 33.90625 L 2.8125 26.40625 Z M 25.03125 29.0625 L 34 35.90625 C 34.328125 36.15625 34.773438 36.179688 35.125 35.96875 L 39 33.65625 L 39 38.65625 L 25 47.78125 L 11 38.53125 L 11 33.5625 L 15.09375 35.96875 C 15.453125 36.171875 15.898438 36.136719 16.21875 35.875 Z"></path>
      </svg>
    </Button>
  );
  const DropboxOpenBtn = canOpenDropbox(DtopboxBtn);

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

    const clientRef = doc(db, `users/${authUser.uid}/clients/${params.client}`);
    const docSnap = await getDoc(clientRef);
    const clientData = docSnap.exists() ? docSnap : null;
    const overallClientDataSize = clientData
      ? clientData.data()?.overallClientDataSize || 0
      : 0;

    if (overallClientDataSize + fileBlob.size > 2 * 1024 * 1024 * 1024) {
      toast("Total file size exceeds 2GB. Please select smaller files.", {
        description: "Ensure the total size is less than 2GB.",
      });
      setLoading(false);
      setIsUploading(false);

      await logErrorToFirestore(
        authUser.uid,
        params.client,
        "user-fileSize",
        "Total file size exceeds 2GB. Please select smaller files.",
        {
          client_id: params.client,
        }
      );

      return;
    }

    if (fileBlob.size > 100 * 1024 * 1024) {
      toast("File size exceeds 100MB. File not uploaded.", {
        description: "Please ensure file size is less than 100MB.",
      });
      await logErrorToFirestore(
        authUser.uid,
        params.client,
        "user-fileSize",
        "File size exceeds 100MB. File not uploaded.",
        {
          client_id: params.client,
        }
      );
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
        file_type: props.data.value || props.data,
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
      })

      if (props.data == "CompanyBio") {
        const fileId = uniqueId;
        const clientId = params.client;

        await fetch(`/api/update-core-context`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await authUser?.getIdToken()}`,
          },
          body: JSON.stringify({
            file_id: fileId,
            client_id: clientId,
          }),
        });
      }


      return response.json();
    } catch (error: any) {
      console.error("Error uploading file:", error);
      await logErrorToFirestore(
        authUser.uid,
        params.client,
        "process-file",
        error,
        {
          name: originalFileName,
          bucketName: `${fileNameWithoutExtension}_${uniqueId}.${fileExtension}`,
          type: fileBlob.type,
          createdAt: Date.now(),
          size: fileBlob.size,
          file_type: props.data.value || props.data,
        }
      );
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
      const clientRef = doc(
        db,
        `users/${authUser.uid}/clients/${params.client}`
      );
      const docSnap = await getDoc(clientRef);
      const clientData = docSnap.exists() ? docSnap : null;
      const overallClientDataSize = clientData
        ? clientData.data()?.overallClientDataSize || 0
        : 0;

      files.forEach(async (file) => {
        const totalFilesSize = files.reduce((acc, file) => acc + file.size, 0);

        if (overallClientDataSize + totalFilesSize > 2 * 1024 * 1024 * 1024) {
          toast("Total file size exceeds 2GB. Please select smaller files.", {
            description: "Ensure the total size is less than 2GB.",
          });
          setLoading(false);
          setIsUploading(false);

          await logErrorToFirestore(
            authUser.uid,
            params.client,
            "user-fileSize",
            "Total file size exceeds 2GB. Please select smaller files.",
            {
              client_id: params.client,
            }
          );

          return;
        }

        if (file.size > 100 * 1024 * 1024) {
          toast("File size exceeds 100MB. File not uploaded.", {
            description: "Please ensure file size is less than 100MB.",
          });
          setFiles([]);

          await logErrorToFirestore(
            authUser.uid,
            params.client,
            "user-fileSize",
            "File size exceeds 100MB. File not uploaded.",
            {
              client_id: params.client,
            }
          );
          return;
        }

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
                file_type: props.data.value || props.data,
              };

              await setDoc(docRef, data);

              const url = `https://data-extractor-87008435117.us-central1.run.app/process-file`;

              try {
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
                    file_type:
                      tab === "mediadatabase" ? "media_db" : "document",
                  }),
                });

                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(
                    `Error ${response.status}: ${errorData.message || "Unknown error"
                    }`
                  );
                }

                if (props.data == "CompanyBio") {
                  const fileId = uniqueId;
                  const clientId = params.client;
          
                  await fetch(`/api/update-core-context`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${await authUser?.getIdToken()}`,
                    },
                    body: JSON.stringify({
                      file_id: fileId,
                      client_id: clientId,
                    }),
                  });
                }


                return response.json();
              } catch (error) {
                console.error("Error during data extraction:", error);
                await logErrorToFirestore(
                  authUser.uid,
                  params.client,
                  "process-file",
                  error as string,
                  data
                );
                await deleteObject(storageRef).catch((deleteError) => {
                  console.error(
                    "Error deleting file from storage:",
                    deleteError
                  );
                });
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
                toast("Error during data extraction", {
                  description: "An error occurred during data extraction",
                });
                throw error;
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
                error.message,
                {
                  name: originalFileName,
                  bucketName: `${fileNameWithoutExtension}_${uniqueId}.${fileExtension}`,
                  type: file.type,
                  createdAt: Date.now(),
                  size: file.size,
                }
              );

              // await deleteObject(storageRef).catch((deleteError) => {
              //   console.error("Error deleting file from storage:", deleteError);
              // });
              // // Remove the document from Firestore
              // await deleteDoc(
              //   doc(
              //     db,
              //     `users/${authUser.uid}/clients/${params.client}/files`,
              //     uniqueId
              //   )
              // ).catch((deleteError) => {
              //   console.error(
              //     "Error deleting document from Firestore:",
              //     deleteError
              //   );
              // });

              // Inform the user about the error
              toast("Error during data extraction", {
                description: "An error occurred during data extraction",
              });
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
        );
      } finally {
        clearInterval(fakeProgressInterval);
        setLoading(false);
        setUploadProgress(0);
        setFakeProgress(0);
        setFiles([]);
      }
    }
  };

  const DropboxUpload = async (
    processedFiles: { link: string; name: string }[]
  ) => {
    setUploadProgress(0);
    setFakeProgress(0);

    setLoading(true);
    setIsUploading(true);

    const fakeProgressInterval = setInterval(() => {
      setFakeProgress((prev) => {
        const nextProgress = Math.min(prev + 5, 85);
        return nextProgress;
      });
    }, 150);
    const totalFiles = processedFiles.length;
    let uploadedCount = 0;

    for (const file of processedFiles) {
      try {
        const fileBlob = await fetch(file.link).then((res) => res.blob());
        console.log(fileBlob);
        const result = await uploadFileToFirebase(fileBlob, file.name);
        uploadedCount++;
        setUploadProgress((uploadedCount / totalFiles) * 100);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setIsUploading(false);
      }
    }
    setDownloadfromDrive(null);
    setLoading(false);
    setIsUploading(false);
    setFiles([]);
    clearInterval(fakeProgressInterval);
    setUploadProgress(0);
    setFakeProgress(0);
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
                  className="flex flex-row gap-3"
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#5C5C5C] text-white"
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
                          {/* Upload From Drive */}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#5C5C5C]">
                        <p>Comming soon</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <DropboxOpenBtn
                    appKey="j101w30xs3ehgyo"
                    linkType="direct"
                    success={DropboxUpload}
                    multiselect="true"
                  />
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
