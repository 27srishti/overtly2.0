"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import * as React from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
import { cn } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";
import clearCachesByServerAction from "@/lib/revalidation";
import { auth, db } from "@/lib/firebase/firebase";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "@/components/ui/avatar";
import {
  arrayRemove,
  collection,
  doc,
  getDoc,
  updateDoc,
  writeBatch,
  deleteDoc,
} from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

export type FilesData = {
  companyName: string;
  id: string;
  companyURL: string;
};

interface DataTableProps<TData, TValue> {
  data: TData[];
  pageCount: number;
  defaultPerPage?: number;
}

export function CompetesTable<TData extends FilesData, TValue>({
  data,
  pageCount,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  console.log(data);

  const params = useParams<{ client: string }>();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [selectedRows, setSelectedRows] = React.useState<
    Record<string, boolean>
  >({});
  const [filterValue, setFilterValue] = React.useState("");

  const getSelectedRowData = () => {
    return table.getSelectedRowModel().rows.map((row) => row.original);
  };

  const handleDeleteFile = async (file: FilesData) => {
    const authUser = auth.currentUser;

    if (!authUser) {
      console.error("User is not authenticated");
      return;
    }

    const userRef = doc(db, "users", authUser.uid);
    const clientRef = doc(userRef, "clients", params.client);
    const competesRef = collection(clientRef, "competes");
    const fileDocRef = doc(competesRef, file.id);

    try {
      const clientDoc = await getDoc(clientRef);
      if (!clientDoc.exists()) {
        throw new Error("Client document not found");
      }

      await deleteDoc(fileDocRef);

      clearCachesByServerAction(params.client);

      toast({
        title: "Compete removed",
        description:
          "The compete has been successfully removed from the client.",
      });
    } catch (error) {
      console.error("Error deleting compete:", error);
      toast({
        title: "Error",
        description: "An error occurred while removing the compete.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSelectedFiles = async () => {
    const authUser = auth.currentUser;

    if (!authUser) {
      console.error("User is not authenticated");
      return;
    }

    const userRef = doc(db, "users", authUser.uid);
    const clientRef = doc(userRef, "clients", params.client);
    const competesRef = collection(clientRef, "competes");

    try {
      const selectedFiles = getSelectedRowData();
      console.log(selectedFiles);

      for (const file of selectedFiles) {
        const fileDocRef = doc(competesRef, file.id);
        await deleteDoc(fileDocRef);
      }

      clearCachesByServerAction(params.client);

      toast({
        title: "Competes removed",
        description:
          "The selected competes have been successfully removed from the client.",
      });
    } catch (error) {
      console.error("Error deleting competes:", error);
      toast({
        title: "Error",
        description: "An error occurred while removing the competes.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<FilesData>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "companyName", // Updated to match new data structure
      header: "Company Name", // Updated header
      cell: ({ row }) => {
        const data = row.original;
        return (
          <div className="flex flex-col">
            <div className="text-[#3E3E3E] font-semibold text-[15px]">
              {data.companyName}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "companyURL", // Updated to match new data structure
      header: "Company URL", // Updated header
      cell: ({ row }) => {
        const data = row.original;
        return (
          <div className="flex flex-col">
            <div className="text-[#3E3E3E] font-semibold text-[15px]">
              {data.companyURL}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "Delete",
      header: "Delete",
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;

        return (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-10 h-10 rounded-full border bg-transparent shadow-none border-[#797979] border-opacity-30"
              >
                <svg
                  viewBox="0 0 8 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="min-w-[.6rem]"
                >
                  <path
                    d="M8 0.805714L7.19429 0L4 3.19429L0.805714 0L0 0.805714L3.19429 4L0 7.19429L0.805714 8L4 4.80571L7.19429 8L8 7.19429L4.80571 4L8 0.805714Z"
                    fill="black"
                  />
                </svg>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your file
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    handleDeleteFile(data);
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    pageCount,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
      sorting,
      rowSelection: selectedRows,
    },
    onRowSelectionChange: setSelectedRows,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
  });

  const deleteSelectedButton = (
    <Button
      onClick={handleDeleteSelectedFiles}
      disabled={Object.values(selectedRows).filter(Boolean).length === 0}
      className="bg-red-500 hover:bg-red-600 text-white"
    >
      Delete Selected
    </Button>
  );

  return (
    <div>
      <div className="mb-4 flex justify-between">
        {deleteSelectedButton}
        <div className="flex flex-row gap-3 self-end bg-[#F5F5F0] p-1 rounded-[40px] px-2">
          <Input
            placeholder="Filter..."
            value={filterValue}
            onChange={(event) => {
              const value = event.target.value;
              setFilterValue(value);

              if (value.includes("@")) {
                table.getColumn("email")?.setFilterValue(value);
                table.getColumn("name")?.setFilterValue("");
                table.getColumn("phone")?.setFilterValue("");
              } else if (/^\d+$/.test(value)) {
                table.getColumn("phone")?.setFilterValue(value);
                table.getColumn("name")?.setFilterValue("");
                table.getColumn("email")?.setFilterValue("");
              } else {
                table.getColumn("companyName")?.setFilterValue(value);
                table.getColumn("email")?.setFilterValue("");
                table.getColumn("phone")?.setFilterValue("");
              }
            }}
            className="shadow-none border-none"
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
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-none">
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    className={cn("border-none p-1", {
                      "rounded-l-xl": index === 0,
                      "rounded-r-xl": index === headerGroup.headers.length - 1,
                    })}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-none "
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={`${row.id}_${cell.column.id}`}
                      className={cn(" p-2 bg-[#D8D8D8] bg-opacity-20", {
                        "rounded-tl-xl rounded-bl-xl": index === 0,
                        "rounded-tr-xl rounded-br-xl":
                          index === row.getVisibleCells().length - 1,
                      })}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
