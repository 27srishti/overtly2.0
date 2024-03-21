"use client";

import { Icons } from "@/components/ui/Icons";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

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
    <>
    <div className="sticky top-0 z-50 bg-secondary">
      <div className="border-b bg-opacity-20  backdrop-filter backdrop-blur-lg py-2">
        <div className="container flex justify-between px-2 items-center">
          <div
            className="flex items-center justify-center text-lg cursor-pointer"
            onClick={() => router.push("/dashboard")}
          ><img src="/images.png" className="w-8 ml-3" alt="Logo" />
            
            {/* <svg
              width="47"
              height="47"
              viewBox="0 0 47 47"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-12"
            >
              <path
                d="M10 15L24 33"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 18L33 35"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg> */}

            {/* <img src="/images.png" className="w-12" alt="Logo" /> */}
            <div className="ml-2">Overtly</div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        user?.photoURL ??
                        "https://avatars.githubusercontent.com/u/124599?v=4"
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
      <div className="container px-0 relative ">
        <div className="flex transition  duration-1000 ease-in-out">
          <div
            className={`${
              mini ? "w-16" : "w-44 rounded-r-sm"
            } sm:w-44 z-50 h-[calc(100vh-1rem)] fixed top-15 border-x cursor-pointer flex flex-col gap-3 bg-opacity-20  backdrop-filter backdrop-blur-lg border-opacity-20 transition  duration-1000 ease-in-out bg-secondary`}
            onMouseOver={toggleSidebar}
            onMouseOut={toggleSidebar}
          >
            <div
              className={`flex items-center py-2 px-4 mt-6 gap-2 
              ${pathname.endsWith(`${client?.id}`) ? "bg-[#c1c1c1]" : "hover:bg-[#EFEFEF]"} 
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
              ${pathname.endsWith("/datalibrary") ? "bg-[#c1c1c1]" : "hover:bg-[#EFEFEF]"} 
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
      </div>
    </>
  );
}
