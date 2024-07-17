"use client";

import { Button } from "@/components/ui/button";
import { auth, db, storage } from "@/lib/firebase/firebase";
import clearCachesByServerAction from "@/lib/revalidation";
import { ColumnDef } from "@tanstack/react-table";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useParams } from "next/navigation";

export type Payment = {
  id: string;
  url: string;
  name: string;
  originalName: string;
  type: string;
  createdAt: string;
  bucketName: string;
  filesCategory: string;
};




export const columns: ColumnDef<Payment>[] = [
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
        <Button
          variant="outline"
          className="w-10 h-10 rounded-full border bg-transparent shadow-none border-[#797979] border-opacity-30"
          onClick={()=>{console.log(data)}}
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
      );
    },
  },
];
