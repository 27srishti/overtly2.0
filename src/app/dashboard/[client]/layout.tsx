"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useParams, usePathname } from "next/navigation";
import { useClientStore } from "@/store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { User, LifeBuoy, CreditCard, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/firebase";
import { signOut } from "firebase/auth";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mini, setMini] = useState(true);
  const { client } = useClientStore();
  const toggleSidebar = () => {
    setMini((prevState) => !prevState);
  };
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ client: string }>();
  const user = auth.currentUser;

  async function signOutUser() {
    await signOut(auth).then(async () => {
      await fetch("/api/signOut", {
        method: "POST",
      }).then((response) => {
        if (response.status === 200) {
          router.push("/");
          toast({
            description: "Sign out successful!",
          });
        }
      });
    });
  }

  return (
    <div className="gradientbg">
      <div className="sticky top-0 backdrop-filter backdrop-blur-lg border-b pb-2 z-10 ">
        <div className="z-50 pt-4  sm:px-6 md:px-10 font-montserrat">
          <div className="bg-opacity-20 py-2 px-2">
            <div className=" flex flex-col flex-wrap justify-center sm:justify-between items-center md:flex-row md:justify-center xl:justify-between md:gap-5
            ">
              <Link href={`/dashboard`}>
                <div className="flex items-center justify-center text-lg cursor-pointer">
                  <img
                    src="/fullimage.png"
                    className="w-20 sm:w-28 md:w-36 ml-3"
                    alt="Logo"
                  />
                </div>
              </Link>
              <div className="flex flex-col sm:flex-col md:flex-row gap-2 sm:gap-3 md:gap-5 mt-2 md:mt-0 items-center">
                <div className="flex flex-row sm:flex-row gap-2 sm:gap-3 md:gap-5 mt-2 md:mt-0 items-center">
                  <Link href={`/dashboard`}>
                    <div className="rounded-full p-2 sm:p-3 bg-[#E8E8E8] flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#6d6d6e"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path
                          d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z"
                          className="w-6 h-6"
                        />
                      </svg>
                    </div>
                  </Link>
                  <div className="flex flex-row sm:flex-row gap-2 sm:gap-4 md:gap-7 rounded-full items-center border-[#D5D5D5] border py-1 px-1 bg-white">

                    <Link href={`/dashboard/${client?.id}/research`}>
                      <div
                        className={`${pathname.endsWith("/research") ||
                          pathname.endsWith("/chat") ||
                          pathname.endsWith("/insights")
                          ? "bg-[#BDF294] hover:bg-[#b3f87d]"
                          : "bg-white hover:bg-[#F5F4F4]"
                          } rounded-full items-center p-1 sm:p-2 px-3 sm:px-5 cursor-pointer transition-all`}
                      >
                        Research
                      </div>
                    </Link>
                    <Link href={`/dashboard/${client?.id}`}>
                      <div
                        className={`rounded-full items-center p-1 sm:p-2 px-3 sm:px-5 ${pathname.endsWith(params.client) ||
                          pathname.endsWith("create")
                          ? "bg-[#BDF294] hover:bg-[#b3f87d]"
                          : "hover:bg-[#F5F4F4]"
                          } cursor-pointer transition-all`}
                      >
                        Workflow
                      </div>
                    </Link>
                    <Link href={`/dashboard/${client?.id}/analytics`}>
                      <div
                        className={`${pathname.endsWith("/analytics")
                          ? "bg-[#BDF294] hover:bg-[#b3f87d]"
                          : "bg-white hover:bg-[#F5F4F4]"
                          } rounded-full items-center p-1 sm:p-2 px-3 sm:px-5 cursor-pointer transition-all`}
                      >
                        Analytics
                      </div>
                    </Link>
                  </div>
                </div>
                <Link
                  href={`/dashboard/${params.client}/datalibrary?page=1&per_page=5&sort=type.desc&view=folder`}
                >
                  <div
                    className={`${pathname.endsWith("/datalibrary")
                      ? "bg-[#BDF294] hover:bg-[#b3f87d]"
                      : "bg-white hover:bg-[#F5F4F4]"
                      } flex flex-col sm:flex-row gap-2 sm:gap-4 md:gap-7 rounded-full items-center border-[#D5D5D5] border py-1 px-1 cursor-pointer transition-all mt-4 sm:mt-0`}
                  >
                    <div className="rounded-full items-center p-1 sm:p-2 px-3 sm:px-5 cursor-pointer flex gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        enableBackground="new 0 0 24 24"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#6d6d6e"
                      >
                        <g>
                          <rect fill="none" height="24" width="24" />
                          <path
                            d="M20,6h-8l-2-2H4C2.9,4,2.01,4.9,2.01,6L2,18c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V8C22,6.9,21.1,6,20,6z M14,16H6v-2h8V16z M18,12H6v-2h12V12z"
                            className="w-5 h-5 stroke-[#6d6d6e] stroke-[.2px]"
                          />
                        </g>
                      </svg>
                      Data Library
                    </div>
                  </div>
                </Link>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 md:gap-5 mt-2 md:mt-0">
                <div className="bg-secondary p-2 sm:p-3 rounded-full h-10 w-10 flex items-center justify-center">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-full w-full"
                  >
                    <g clipPath="url(#clip0_1455_1874)">
                      <path
                        d="M13.75 2.41667H13.0417V1H11.625V2.41667H4.54167V1H3.125V2.41667H2.41667C1.6375 2.41667 1 3.05417 1 3.83333V15.1667C1 15.9458 1.6375 16.5833 2.41667 16.5833H13.75C14.5292 16.5833 15.1667 15.9458 15.1667 15.1667V3.83333C15.1667 3.05417 14.5292 2.41667 13.75 2.41667ZM13.75 15.1667H2.41667V5.95833H13.75V15.1667Z"
                        fill="#747474"
                      />
                      <rect x="10" y="8" width="2" height="2" fill="#BBBBBB" />
                      <rect x="4" y="8" width="5" height="2" fill="#BBBBBB" />
                      <defs>
                        <clipPath id="clip0_1455_1874">
                          <rect width="16.1667" height="17" fill="white" />
                        </clipPath>
                      </defs>
                    </g>
                  </svg>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger >
                    <div className=" h-10 w-10 rounded-full font-inter">
                      <Avatar className="h-full w-full">
                        <AvatarImage
                          src={user?.photoURL || ""}
                          alt={user?.displayName || ""}
                        />
                        <AvatarFallback>
                          {user?.displayName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.displayName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Billing</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        <span>Support</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOutUser}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
