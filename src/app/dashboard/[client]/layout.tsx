"use client";

import { Icons } from "@/components/ui/Icons";
import { useState } from "react";
import Navbar from "@/components/Customcomponent/Navbar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useClientStore } from "@/store";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mini, setMini] = useState(true);
  const { client, setClient } = useClientStore();
  const toggleSidebar = () => {
    setMini((prevState) => !prevState);
  };
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ client: string }>();

  return (
    <>
      <Navbar />
      <div className="container px-0 relative">
        <div className="flex transition  duration-1000 ease-in-out">
          <div
            className={`${
              mini ? "w-16" : "w-44 rounded-r-sm"
            } sm:w-44 z-50 h-[calc(100vh-1rem)] fixed top-12 border-x cursor-pointer flex flex-col gap-3 bg-opacity-20  backdrop-filter backdrop-blur-lg border-opacity-20 transition  duration-1000 ease-in-out`}
            onMouseOver={toggleSidebar}
            onMouseOut={toggleSidebar}
          >
            <div
              className={`flex items-center py-2 px-4 mt-6 gap-2 
              ${pathname.endsWith(`${client?.id}`) ? "bg-secondary" : ""} 
             `}
              onClick={() => {
                router.push(`/dashboard/${params.client}`);
              }}
            >
              <div>
                <Icons.Home />
              </div>
              <span className={`${mini ? "hidden" : ""} sm:block ml-2`}>
                Home
              </span>
            </div>

            <div
              className={`flex items-center py-2 px-4 gap-2 
              ${pathname.endsWith("/datalibrary") ? "bg-secondary" : ""} 
             `}
              onClick={() => {
                router.push(`/dashboard/${params.client}/datalibrary`);
              }}
            >
              <div>
                <Icons.Files />
              </div>
              <span className={`${mini ? "hidden" : ""} sm:block ml-2`}>
                Data&nbsp;Library
              </span>
            </div>

            <div
              className={`flex items-center py-2 px-4 gap-2 
              ${pathname.endsWith("/settings") ? "bg-secondary" : ""} 
             `}
            >
              <div>
                <Icons.Gear />
              </div>
              <div className={`${mini ? "hidden" : ""} sm:block ml-2`}>
                Settings
              </div>
            </div>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
