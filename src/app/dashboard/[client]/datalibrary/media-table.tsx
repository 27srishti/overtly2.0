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
import { auth, } from "@/lib/firebase/firebase";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "@/components/ui/avatar";

export type FilesData = {
  email: string;
  industry: string;
  location: string;
  name: string;
  outlet: string;
  publication: string;
  title: string;
};

interface DataTableProps<TData, TValue> {
  data: TData[];
  pageCount: number;
  defaultPerPage?: number;
}

export function MediaTable<TData extends FilesData, TValue>({
  data,
  pageCount,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([])

  const handleDeleteFile = async (file: FilesData) => {
    const authUser = auth.currentUser;

    if (!authUser) {
      console.error("User is not authenticated");
      return;
    }
  };

  const columns: ColumnDef<FilesData>[] = [
    {
      accessorKey: "name",
      header: "",
      cell: ({ row }) => {
        const data = row.original;

        return (
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={"/profile.png"}
              alt="profileimage"
              className="h-10 w-10"
            />
          </Avatar>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-2"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-2"
          >
            email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "publication",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-2"
          >
            publication
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "phone",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="pl-2"
          >
            phone
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "industry",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="pl-2"
          >
            industry
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
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
    },
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <div className="flex flex-row gap-3 self-end bg-[#F5F5F0] p-1 rounded-[40px] px-2">
          <Input
            placeholder="Filter name..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
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
                      key={cell.id}
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
