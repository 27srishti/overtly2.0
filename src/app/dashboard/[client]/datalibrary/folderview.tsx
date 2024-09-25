"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  useRouter,
  usePathname,
  useSearchParams,
  useParams,
} from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Icons } from "@/components/ui/Icons";
import { Input } from "@/components/ui/input";
import { Filetypes } from "@/lib/dropdown";
import { DashboardIcon, ListBulletIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { auth, db } from "@/lib/firebase/firebase";
import { doc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface File {
  name: string;
  title: string;
  industry: string;
  id: string;
}

const FolderView = () => {
  const [list, setList] = useState(false);
  const [filterInput, setFilterInput] = useState("");
  const params = useParams<{ client: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const [currentFiles, setCurrentFiles] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [DownloadfromDriven, setDownloadfromDrive] = useState<null | number>(
    null
  );
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fakeProgress, setFakeProgress] = useState<number>(0);

  const handleDialogOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) => ({
        name: file.name,
        title: file.name,
        industry: "Default",
        id: file.name,
      }));
      setFiles(filesArray);
    }
  };

  function handleOpenPicker() {}

  const handleFileClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files).map((file) => ({
        name: file.name,
        title: file.name,
        industry: "Default",
        id: file.name,
      }));
      setFiles(filesArray);
      e.dataTransfer.clearData();
    }
  };

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
      // Only fetch if currentFiles is set
      FetchcurrentFiletypefiles();
    }
  }, [currentFiles]);

  const handleFileTypeSelect = (value: string) => {
    setCurrentFiles(value); // Set currentFiles to the selected file type
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
        where("file_type", "==", currentFiles) // Ensure currentFiles is set correctly
      );

      const querySnapshot = await getDocs(q);
      const fetchedFiles = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as File[];

      console.log("Fetched files:", fetchedFiles); // Log fetched files
      setFiles(fetchedFiles);
    } catch (error) {
      console.error("Error fetching files from Firestore:", error);
    }
  };

  const renderedFiletypes = Filetypes.map((option) => (
    <Dialog key={option.value}>
      <DialogTrigger className="text-left">
        <div
          className={`flex flex-col p-5 rounded-[35px] gap-5 text-[#3B3B3B] max-w-[275px] aspect-w-4 aspect-h-3 ${option.color}`}
          onClick={() => handleFileTypeSelect(option.value)}
        >
          <div className="flex flex-row justify-between items-center">
            <span
              className={`p-2 rounded-full h-[32px] w-[32px] ${option.colorwheel}`}
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
      <DialogContent className="max-w-[90vw] max-h-[90vh] min-w-[90vw] min-h-[90vh] p-10 px-12 pb-8 font-montserrat pt-5">
        <div>
          <div className="mb0-10">
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
                              <div className="text-xl font-medium">
                                Upload Files
                              </div>
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
                                    Uploading{" "}
                                    {files.length || DownloadfromDriven}{" "}
                                    files...
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
                </div>

                <div>
                  <Table className="border-separate border-spacing-y-4">
                    <TableBody>
                      {files.length > 0 ? (
                        files.map((file, index) => (
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
            className={`absolute top-0 bottom-0 left-0 w-1/2 bg-[#3E3E3E] bg-opacity-80 rounded-full transition-transform duration-300 ${
              list ? "translate-x-0" : "translate-x-full"
            }`}
          ></div>

          <div
            className={`flex-1 flex items-center justify-center gap-4 cursor-pointer rounded-full px-5 transition-colors duration-300 ${
              list ? "text-white" : "text-black"
            }`}
            onClick={() => handleViewModeChange(true)}
            style={{ flexBasis: "50%", zIndex: 1 }}
          >
            List <ListBulletIcon className="w-4 h-4" />
          </div>

          <div
            className={`flex-1 flex items-center justify-center gap-3 cursor-pointer rounded-full px-5 transition-colors duration-300 ${
              !list ? "text-white" : "text-black"
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

      <div className="mx-10 grid grid-cols-4 gap-5 mt-5 font-montserrat">
        {renderedFiletypes}
      </div>
    </div>
  );
};

export default FolderView;
