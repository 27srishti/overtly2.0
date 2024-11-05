"use client";

import { Icons } from "@/components/ui/Icons";
import { useClientStore } from "@/store";
import { CompassIcon } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { client } = useClientStore();
  const params = useParams<{ client: string }>();
  return (
<div className="grid w-full grid-cols-[70px_1fr] xl:grid-cols-[80px_1fr] p-5 gap-5 xl:gap-10 pt-10 font-montserrat">
  <div className="flex flex-col items-center h-[83vh] bg-white sticky top-0 border rounded-[30px] gap-10 transition-all duration-500 ease-in-out w-24 hover:w-[12rem] p-6 relative group z-50">

    <Link href={`/dashboard/${client?.id}/research`} className="flex items-center w-full">
      <div
        className={`flex items-center justify-center w-12 h-12 group-hover:w-full rounded-full transition-all  duration-500 ${pathname.endsWith("discover") || pathname.endsWith("research")
          ? "bg-[#FFAEB5] text-white"
          : "bg-[#F6F6F6] text-black hover:bg-[#EBE6E6]"
          }`}
      >
        <Icons.Compass className="text-xl" />

        <span
          className={`ml-4 text-sm font-medium whitespace-nowrap transition-all duration-500 hidden  delay-200 ${pathname.endsWith("discover") || pathname.endsWith("research")
            ? "text-white"
            : "text-black "
            } group-hover:flex `}
        >
          Discover
        </span>
      </div>
    </Link>


    <Link href={`/dashboard/${client?.id}/research/trends`} className="group flex items-center w-full">
      <div
        className={`flex items-center justify-center w-12 h-12 group-hover:w-full rounded-full transition-all duration-500 ${pathname.endsWith("trends")
          ? "bg-[#FFAEB5] text-white"
          : "bg-[#F6F6F6] text-black hover:bg-[#EBE6E6]"
          }`}
      >
        <Icons.Trends className="text-xl" />

        <span
          className={`ml-4 text-sm font-medium whitespace-nowrap transition-all duration-500 hidden ${pathname.endsWith("trends")
            ? "text-white"
            : "text-black"
            } group-hover:flex`}
        >
          Trends
        </span>
      </div>
    </Link>









    <Link href={`/dashboard/${client?.id}/research/Topics`} className="group flex items-center w-full">
      <div
        className={`flex items-center justify-center w-12 h-12 group-hover:w-full rounded-full transition-all duration-500 ${pathname.endsWith("Topics")
          ? "bg-[#FFAEB5] text-white"
          : "bg-[#F6F6F6] text-black hover:bg-[#EBE6E6]"
          }`}
      >
        <Icons.Flowchart className="text-xl" />

        <span
          className={`ml-4 text-sm font-medium whitespace-nowrap transition-all duration-500 hidden ${pathname.endsWith("Topics")
            ? "text-white"
            : "text-black"
            } group-hover:flex`}
        >
          Topics
        </span>
      </div>
    </Link>

    <Link href={`/dashboard/${client?.id}/research/Trends`} className="group flex items-center w-full">
      <div
        className={`flex items-center justify-center  w-12 h-12 group-hover:w-full rounded-full transition-all  duration-500 ${pathname.endsWith("Trends")
          ? "bg-[#FFAEB5] text-white"
          : "bg-[#F6F6F6] text-black hover:bg-[#EBE6E6]"
          }`}
      >
        <Icons.Wire className="text-xl" />

        <span
          className={`ml-4 text-sm font-medium whitespace-nowrap transition-all duration-500 hidden ${pathname.endsWith("Trends")
            ? "text-white"
            : "text-black"
            } group-hover:flex`}
        >
          Insights
        </span>
      </div>
    </Link>

    <Link href={`/dashboard/${client?.id}/research/chat`} className="group flex items-center w-full">
      <div
        className={`flex items-center justify-center  w-12 h-12 group-hover:w-full rounded-full transition-all  duration-500 ${pathname.endsWith("chat")
          ? "bg-[#FFAEB5] text-white "
          : "bg-[#F6F6F6] text-black hover:bg-[#EBE6E6]"
          }`}
      >
        <Icons.Chat className="text-xl" />

        <span
          className={`ml-4 text-sm font-medium whitespace-nowrap transition-all duration-500 hidden ${pathname.endsWith("chat")
            ? "text-white"
            : "text-black"
            } group-hover:flex`}
        >
          Converse
        </span>
      </div>
    </Link>
  </div>

  <div className="w-full rounded-[30px] flex flex-col bg-opacity-25">
    {children}
  </div>
</div>


  );
}
