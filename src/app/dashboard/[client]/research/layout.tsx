"use client";

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
    <div className="grid w-full grid-cols-[300px_1fr] p-5 gap-10  pt-10 font-montserrat">
      <div className="w-full rounded-[40px] p-5 flex flex-col justify-between h-[83vh] py-10 bg-opacity-25 sticky top-[7.6rem] border">
        <div className="flex gap-5 flex-col px-5">
          <Link href={`/dashboard/${client?.id}/research`}>
            <div
              className={`rounded-full items-center p-2 px-5 ${
                pathname.endsWith("discover") || pathname.endsWith("research")
                  ? "bg-[#FFAEB5]  text-white bg-opacity-70"
                  : "bg-[#F6F6F6] "
              } rounded-full items-center  p-4 px-5 cursor-pointer transition-all text-center rounded-[40px]`}
            >
          <div className="flex items-center align-middle justify-center gap-2"><div>    Discover</div> <img src="/compass.png" className="h-5"/> </div>
            </div>
          </Link>
          <Link href={`/dashboard/${client?.id}/research/Topics`}>
            <div
              className={`rounded-full items-center p-2 px-5 ${
                pathname.endsWith("Topics")
                  ? "bg-[#FFAEB5]  text-white bg-opacity-70"
                  : "bg-[#F6F6F6] "
              } rounded-full items-center  p-4 px-5 cursor-pointer transition-all text-center rounded-[40px]`}
            >
              Topics
            </div>
          </Link>
          <Link href={`/dashboard/${client?.id}/research/insights`}>
            <div
              className={`rounded-full items-center p-2 px-5 ${
                pathname.endsWith("insights")
                  ? "bg-[#FFAEB5]  text-white bg-opacity-70"
                  : "bg-[#F6F6F6] "
              } rounded-full items-center  p-4 px-5 cursor-pointer transition-all text-center rounded-[40px]`}
            >
              Insights
            </div>
          </Link>
          <Link href={`/dashboard/${client?.id}/research/Trends`}>
            <div
              className={`rounded-full items-center p-2 px-5 ${
                pathname.endsWith("Trends")
                  ? "bg-[#FFAEB5]  text-white bg-opacity-70"
                  : "bg-[#F6F6F6] "
              } rounded-full items-center  p-4 px-5 cursor-pointer transition-all text-center rounded-[40px]`}
            >
              Trends
            </div>
          </Link>
          <Link href={`/dashboard/${client?.id}/research/chat`}>
            <div
              className={`rounded-full items-center p-2 px-5 ${
                pathname.endsWith("chat")
                  ? "bg-[#FFAEB5]  text-white bg-opacity-70"
                  : "bg-[#F6F6F6] "
              } rounded-full items-center  p-4 px-5 cursor-pointer transition-all text-center rounded-[40px]`}
            >
              Chat
            </div>
          </Link>

        </div>
        <div className="text-center border rounded-[40px] p-4 border-1 border-[#4A4A4A]">
            Start a Thread
        </div>
      </div>
      <div className="w-full rounded-[30px] flex flex-col bg-opacity-25">
        {children}
      </div>
    </div>
  );
}
