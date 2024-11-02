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
    <div className="grid w-full grid-cols-[250px_1fr] xl:grid-cols-[70px_1fr] p-5 gap-5 xl:gap-10 pt-10 font-montserrat">
      <div className="w-20 py-10 flex flex-col items-center h-[83vh] bg-white sticky top-0 border rounded-[40px] gap-5">
        <Link href={`/dashboard/${client?.id}/research`} className="group mb-4 flex items-center text-center font-raleway">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full z-50 ${pathname.endsWith("discover") || pathname.endsWith("research")
                ? "bg-[#FFAEB5] text-white"
                : "bg-[#F6F6F6] text-black"
              }`}
          >
            <Icons.Compass
              className={`text-xl ${pathname.endsWith("discover") || pathname.endsWith("research")
                  ? "text-white"
                  : "text-black"
                }`}
            />
          </div>

          <div
            className={`absolute flex items-center justify-center text-center pr-5 py-2 h-12 max-w-0 opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:opacity-100 overflow-hidden whitespace-nowrap rounded-full ${pathname.endsWith("discover") || pathname.endsWith("research")
                ? "bg-[#FFAEB5] text-white"
                : "bg-[#F6F6F6] text-black"
              }`}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ease-in-out hover:rounded-r">
              <Icons.Compass />
            </div>
            <span className="text-sm font-medium">Discover</span>
          </div>
        </Link>



        <Link href={`/dashboard/${client?.id}/research/Topics`} className="group mb-4 flex items-center text-center">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full z-50 ${pathname.endsWith("Topics") 
                ? "bg-[#FFAEB5] text-white"
                : "bg-[#F6F6F6] text-black"
              }`}
          >
            <Icons.Trends 
              className={`text-xl ${pathname.endsWith("Topics")
                  ? "text-white"
                  : "text-black"
                }`}
            />
          </div>

          <div
            className={`absolute flex items-center justify-center text-center pr-5 py-2 h-12 max-w-0 opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:opacity-100 overflow-hidden whitespace-nowrap rounded-full ${pathname.endsWith("Topics")
                ? "bg-[#FFAEB5] text-white"
                : "bg-[#F6F6F6] text-black"
              }`}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ease-in-out hover:rounded-r">
            <Icons.Trends />
            </div>
            <span className="text-sm font-medium">Trends</span>
          </div>
        </Link>




        <Link href={`/dashboard/${client?.id}/research/Topics`} className="group mb-4 flex items-center text-center">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full z-50 ${pathname.endsWith("Topics") 
                ? "bg-[#FFAEB5] text-white"
                : "bg-[#F6F6F6] text-black"
              }`}
          >
            <Icons.Trends 
              className={`text-xl ${pathname.endsWith("Topics")
                  ? "text-white"
                  : "text-black"
                }`}
            />
          </div>

          <div
            className={`absolute flex items-center justify-center text-center pr-5 py-2 h-12 max-w-0 opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:opacity-100 overflow-hidden whitespace-nowrap rounded-full ${pathname.endsWith("Topics")
                ? "bg-[#FFAEB5] text-white"
                : "bg-[#F6F6F6] text-black"
              }`}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ease-in-out hover:rounded-r">
            <Icons.Trends />
            </div>
            <span className="text-sm font-medium">Trends</span>
          </div>
        </Link>







        <Link href={`/dashboard/${client?.id}/research/Trends`} className="group mb-4 flex items-center text-center">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full z-50 ${pathname.endsWith("Trends") 
                ? "bg-[#FFAEB5] text-white"
                : "bg-[#F6F6F6] text-black"
              }`}
          >
            <Icons.Wire 
              className={`text-xl ${pathname.endsWith("Trends")
                  ? "text-white"
                  : "text-black"
                }`}
            />
          </div>

          <div
            className={`absolute flex items-center justify-center text-center pr-5 py-2 h-12 max-w-0 opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:opacity-100 overflow-hidden whitespace-nowrap rounded-full ${pathname.endsWith("Insights")
                ? "bg-[#FFAEB5] text-white"
                : "bg-[#F6F6F6] text-black"
              }`}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ease-in-out hover:rounded-r">
            <Icons.Wire />
            </div>
            <span className="text-sm font-medium">Insights</span>
          </div>
        </Link>




        <Link href={`/dashboard/${client?.id}/research/chat`} className="group mb-4 flex items-center text-center">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full z-50 ${pathname.endsWith("chat") 
                ? "bg-[#FFAEB5] text-white"
                : "bg-[#F6F6F6] text-black"
              }`}
          >
            <Icons.Chat  
              className={`text-xl ${pathname.endsWith("chat")
                  ? "text-white"
                  : "text-black"
                }`}
            />
          </div>

          <div
            className={`absolute flex items-center justify-center text-center pr-5 py-2 h-12 max-w-0 opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:opacity-100 overflow-hidden whitespace-nowrap rounded-full ${pathname.endsWith("chat")
                ? "bg-[#FFAEB5] text-white"
                : "bg-[#F6F6F6] text-black"
              }`}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ease-in-out hover:rounded-r">
            <Icons.Chat  />
            </div>
            <span className="text-sm font-medium">Converse</span>
          </div>
        </Link>










      </div>






      <div className="w-full rounded-[30px] flex flex-col bg-opacity-25">
        {children}
      </div>
    </div>
  );
}
