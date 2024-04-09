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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { CubeIcon } from "@radix-ui/react-icons";

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
                <div className="rounded-full p-3 bg-[#E8E8E8]">
                  <HomeIcon className="w-5 h-5 stroke-[#6d6d6e]" />
                </div>
              </Link>
              <div className="flex gap-7 rounded-full items-center border-[#D5D5D5] border py-1 px-1 cursor-pointer">
                <div className="rounded-full items-center bg-[#BDF294] p-2 px-5">
                  Pitch gen
                </div>
                <div className="rounded-full items-center  p-2 px-5 cursor-pointer">
                  Research
                </div>
                <div className="rounded-full items-center  p-2 px-5 cursor-pointer">
                  Analytics
                </div>
              </div>
              <div
                className={`${
                  pathname.endsWith("/datalibrary") ? "bg-[#BDF294] " : ""
                } flex gap-7 rounded-full items-center border-[#D5D5D5] border py-1 px-1 cursor-pointer`}
              >
                <Link href={`/dashboard/${params.client}/datalibrary`}>
                  <div
                    className={`rounded-full items-center p-2 px-5 cursor-pointer flex gap-2`}
                  >
                    <CubeIcon className="w-5 h-5 stroke-[#6d6d6e] stroke-[.2px]" />
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
                <img src="/bell.png" alt="bell" />
                {/* <BellIcon className="w-5 h-5" /> */}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
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
