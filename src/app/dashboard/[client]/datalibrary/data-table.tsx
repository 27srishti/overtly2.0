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
  PaginationState,
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
import { auth, db, storage } from "@/lib/firebase/firebase";
import { deleteObject, ref } from "firebase/storage";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

export type FilesData = {
  id: string;
  url: string;
  name: string;
  originalName: string;
  type: string;
  createdAt: string;
  bucketName: string;
  filesCategory: string;
};

interface DataTableProps<TData, TValue> {
  data: TData[];
  pageCount: number;
  defaultPerPage?: number;
}

export function DataTable<TData extends FilesData, TValue>({
  data,
  pageCount,
  defaultPerPage = 5,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams<{ client: string }>();
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const handleDeleteFile = async (file: FilesData) => {
    const authUser = auth.currentUser;

    if (!authUser) {
      console.error("User is not authenticated");
      return;
    }

    const storageRef = ref(storage, file.url);

    try {
      await deleteObject(storageRef);
      console.log("File deleted from storage:", file.name);
    } catch (error) {
      console.error("Error deleting file from storage:", error);
      return;
    }

    try {
      const docRef = collection(
        db,
        `users/${authUser?.uid}/clients/${params.client}/files`
      );
      const querySnapshot = await getDocs(docRef);
      const docIdToDelete = querySnapshot.docs.find(
        (doc) => doc.data().name === file.name
      )?.id;

      if (docIdToDelete) {
        await deleteDoc(
          doc(
            db,
            `users/${authUser?.uid}/clients/${params.client}/files`,
            docIdToDelete
          )
        );
        console.log("File metadata deleted from Firestore:", file.name);

        const url = `https://pr-ai-99.uc.r.appspot.com/file`;

        return fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await authUser?.getIdToken()}`,
          },
          body: JSON.stringify({
            client_id: params.client,
            file_name: file.bucketName,
          }),
        })
          .then((response) => {
            console.log(response.json());
          })
          .catch((error) => console.error("Error:", error));
      }
    } catch (error) {
      console.error("Error deleting file metadata from Firestore:", error);
    } finally {
      clearCachesByServerAction(pathname);
    }
  };

  const columns: ColumnDef<FilesData>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "type",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Type
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

  // Search params
  const page = parseInt(searchParams.get("page") as string, 10) || 1;
  const perPage =
    parseInt(searchParams.get("per_page") as string, 10) || defaultPerPage;
  const sort = searchParams.get("sort") || "";
  const [column, order] = sort.split(".") ?? [];
  const filterName = searchParams.get("name") || "";

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: page - 1,
      pageSize: perPage,
    });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: column ?? "",
      desc: order === "desc",
    },
  ]);

  const [filterInput, setFilterInput] = React.useState(filterName);
  const [debouncedFilterInput] = useDebounce(filterInput, 500);

  React.useEffect(() => {
    setColumnFilters([{ id: "name", value: debouncedFilterInput }]);
  }, [debouncedFilterInput]);

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page: pageIndex + 1,
        per_page: pageSize,
        sort: sorting[0]?.id
          ? `${sorting[0].id}.${sorting[0].desc ? "desc" : "asc"}`
          : null,
        name: debouncedFilterInput || null,
      })}`,
      { scroll: false }
    );
  }, [
    pageIndex,
    pageSize,
    sorting,
    columnFilters,
    createQueryString,
    pathname,
    router,
    debouncedFilterInput,
  ]);

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
      sorting,
      columnFilters,
    },
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleChangeRowsPerPage = (newPerPage: number) => {
    setPagination({ pageIndex: 0, pageSize: newPerPage });
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <div className="flex flex-row gap-3 self-end bg-[#F5F5F0] p-1 rounded-[40px] px-2">
          <Input
            placeholder="Filter name..."
            value={filterInput}
            onChange={(event) => setFilterInput(event.target.value)}
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
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm">Rows per page:</span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-[30px] bg-[#636363] text-white"
            onClick={() => handleChangeRowsPerPage(5)}
            disabled={pageSize === 5}
          >
            5
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-[30px] bg-[#636363] text-white"
            onClick={() => handleChangeRowsPerPage(10)}
            disabled={pageSize === 10}
          >
            10
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-[30px] bg-[#636363] text-white"
            onClick={() => handleChangeRowsPerPage(20)}
            disabled={pageSize === 20}
          >
            20
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-[30px] bg-[#636363] text-white"
            onClick={() => handleChangeRowsPerPage(50)}
            disabled={pageSize === 50}
          >
            50
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            className="rounded-[30px] bg-[#636363] text-white"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            className="rounded-[30px] bg-[#636363] text-white"
            size="lg"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
