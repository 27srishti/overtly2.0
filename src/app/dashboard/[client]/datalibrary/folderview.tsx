"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
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
  const searchParams = useSearchParams();
  const [currentFiles, setCurrentFiles] = useState("");
  const [files, setFiles] = useState<File[]>([]);

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
      setFiles(fetchedFiles); // Update files state with fetched data
    } catch (error) {
      console.error("Error fetching files from Firestore:", error);
    }
  };
  const renderedFiletypes = useMemo(() => {
    return Filetypes.map((option) => (
      <Dialog key={option.value}>
        <DialogTrigger className="text-left">
          <div
            className={`flex flex-col p-5 rounded-[35px] gap-5 text-[#3B3B3B] max-w-[275px] aspect-w-4 aspect-h-3 ${option.color}`}
            onClick={() => handleFileTypeSelect(option.value)} // Cal
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
                  <div className="flex flex-row p-2 w-full justify-end ">
                    <div className="flex flex-row gap-3 self-end bg-[#F5F5F0] p-1 rounded-[40px] ">
                      <Input
                        type="search"
                        placeholder="Search Data"
                        className="shadow-none border-none"
                        value=""
                        onChange={(e) => {}}
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

                  <div>
                    <Table className="border-separate border-spacing-y-4">
                      <TableHeader className="bg-[#F7F7F7]">
                        <TableRow className="rounded-xl">
                          <TableHead className="rounded-l-xl"></TableHead>
                          <TableHead></TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Industry</TableHead>
                          <TableHead className="rounded-r-xl">Title</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {files.length > 0 ? ( // Check if files array is not empty
                          files.map((file, index) => (
                            <TableRow key={index} className="bg-[#F7F7F7]">
                              <TableCell>{file.name}</TableCell>{" "}
                              {/* Display file name */}
                            </TableRow>
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
  }, [Filetypes]);

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
