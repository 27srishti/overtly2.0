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
import {
  User,
  LifeBuoy,
  CreditCard,
  Settings,
  LogOut,
  HomeIcon,
} from "lucide-react";
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
            description: "Sign out sucessfull!",
          });
        }
      });
    });
  }

  return (
    <div className="gradientbg">
      <div className="sticky top-0 z-50 pt-4 px-10 font-montserrat">
        <div className=" bg-opacity-20  backdrop-filter backdrop-blur-lg py-2">
          <div className="container flex justify-between px-2 items-center">
            <Link href={`/dashboard`}>
              <div className="flex items-center justify-center text-lg cursor-pointer">
                <img src="/fullimage.png" className="w-36 ml-3" alt="Logo" />
              </div>
            </Link>

            <div className="flex gap-5">
              <Link href={`/dashboard`}>
                <div className="rounded-full p-3 bg-[#E8E8E8] flex items-center">
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
              <div className="flex gap-7 rounded-full items-center border-[#D5D5D5] border py-1 px-1 cursor-pointer bg-white">
                <Link href={`/dashboard/${client?.id}`}>
                  <div
                    className={`rounded-full items-center p-2 px-5 ${
                      pathname.endsWith(params.client) ||
                      pathname.endsWith("create")
                        ? "bg-[#BDF294] hover:bg-[#b3f87d]"
                        : "hover:bg-[#F5F4F4]"
                    }transition-all`}
                  >
                    Pitch gen
                  </div>
                </Link>
                <Link href={`/dashboard/${client?.id}/research`}>
                  <div
                    className={`
                  ${
                    pathname.endsWith("/research")
                      ? "bg-[#BDF294] hover:bg-[#b3f87d]"
                      : "bg-white hover:bg-[#F5F4F4]"
                  }
                  
                  rounded-full items-center  p-2 px-5 cursor-pointer transition-all`}
                  >
                    Research
                  </div>
                </Link>
                <div
                  className={`
                ${
                  pathname.endsWith("/analytics")
                    ? "bg-[#BDF294] hover:bg-[#b3f87d]"
                    : "bg-white hover:bg-[#F5F4F4]"
                }
                rounded-full items-center  p-2 px-5 cursor-pointer transition-all`}
                >
                  Analytics
                </div>
              </div>
              <div
                className={`${
                  pathname.endsWith("/datalibrary")
                    ? "bg-[#BDF294] hover:bg-[#b3f87d]"
                    : "bg-white hover:bg-[#F5F4F4]"
                } flex gap-7 rounded-full items-center border-[#D5D5D5] border py-1 px-1 cursor-pointer transition-all`}
              >
                <Link href={`/dashboard/${params.client}/datalibrary`}>
                  <div
                    className={`rounded-full items-center p-2 px-5 cursor-pointer flex gap-2  `}
                  >
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
                </Link>
              </div>
              {/* <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/${client?.id}`}>
                      {client?.name ? (
                        client.name
                      ) : (
                        <Skeleton className="h-4 w-[20px]" />
                      )}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {pathname.endsWith(`${client?.id}`) ? "Home" : ""}
                      {pathname.endsWith("/datalibrary") ? "Data Library" : ""}
                      {pathname.endsWith("/create") ? "Create" : ""}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb> */}
            </div>
            <div className="flex items-center gap-5">
              {/* <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard
              </Button> */}
              <div className=" bg-secondary p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#727272"
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path
                    d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.89 0 1.34-1.08.71-1.71L18 16z"
                    className="w-5 h-5"
                  />
                </svg>
                {/* <BellIcon className="w-5 h-5" /> */}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full mr-4"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          user?.photoURL ??
                          "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg"
                        }
                        alt="profileimage"
                      />
                      <AvatarFallback>CH</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
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
                    <DropdownMenuItem disabled>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <LifeBuoy className="mr-2 h-4 w-4" />
                      <span>Support</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuItem disabled>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
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
      {/* <div className="container px-0 relative ">
        <div className="flex transition  duration-1000 ease-in-out">
          <div
            className={`${
              mini ? "w-16" : "w-44 rounded-r-sm"
            } sm:w-44 z-50 h-[calc(100vh-1rem)] fixed top-15 border-x cursor-pointer flex flex-col gap-3 bg-opacity-20  backdrop-filter backdrop-blur-lg border-opacity-20 transition  duration-1000 ease-in-out bg-secondary`}
            onMouseOver={toggleSidebar}
            onMouseOut={toggleSidebar}
          >
            <Link href={`/dashboard/${params.client}`}>
              <div
                className={`flex items-center py-2 px-4 mt-6 gap-2 
              ${
                pathname.endsWith(`${client?.id}`)
                  ? "bg-[#c1c1c1]"
                  : "hover:bg-[#EFEFEF]"
              } 
             `}
                // onClick={() => {
                //   router.push(`/dashboard/${params.client}`);
                // }}
              >
                <div>
                  <Icons.Home />
                </div>
                <span className={`${mini ? "hidden" : ""} sm:block ml-2`}>
                  Home
                </span>
              </div>
            </Link>
            <Link href={`/dashboard/${params.client}/datalibrary`}>
              <div
                className={`flex items-center py-2 px-4 gap-2 
              ${
                pathname.endsWith("/datalibrary")
                  ? "bg-[#c1c1c1]"
                  : "hover:bg-[#EFEFEF]"
              } 
             `}
                // onClick={() => {
                //   router.push();
                // }}
              >
                <div>
                  <Icons.Files />
                </div>
                <span className={`${mini ? "hidden" : ""} sm:block ml-2`}>
                  Data&nbsp;Library
                </span>
              </div>
            </Link>

            <div
              className={`flex items-center py-2 px-4 gap-2 
              ${
                pathname.endsWith("/settings")
                  ? "bg-primary text-primary-foreground"
                  : ""
              } 
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
      </div> */}
      {children}
    </div>
  );
}
