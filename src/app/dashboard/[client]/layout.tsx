"use client";

import { Icons } from "@/components/ui/Icons";
import { useState } from "react";
import Navbar from "@/components/Customcomponent/Navbar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mini, setMini] = useState(true);
  const toggleSidebar = () => {
    setMini((prevState) => !prevState);
  };
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
            <Link href={`/dashboard/${params.client}`}>
              <div className="flex items-center py-2 px-4 mt-6 gap-2">
                <div>
                  <Icons.Vector />
                </div>
                <span className={`${mini ? "hidden" : ""} sm:block ml-2`}>
                  Home
                </span>
              </div>
            </Link>
            <Link href={`/dashboard/${params.client}/datalibrary`}>
              <div className="flex items-center py-2 px-4 gap-2 gap-2">
                <div>
                  <Icons.Vector />
                </div>
                <span className={`${mini ? "hidden" : ""} sm:block ml-2`}>
                  Data&nbsp;Library
                </span>
              </div>
            </Link>

            <div className="flex items-center py-2 px-4 gap-2">
              <div>
                <Icons.Vector />
              </div>
              <span className={`${mini ? "hidden" : ""} sm:block ml-2`}>
                Analytics
              </span>
            </div>
            <div className="flex items-center py-2 px-4 gap-2">
              <div>
                <Icons.Vector />
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
