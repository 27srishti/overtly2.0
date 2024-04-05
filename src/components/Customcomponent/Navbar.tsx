"use client";

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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { auth } from "@/lib/firebase/firebase";
import { signOut } from "firebase/auth";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BellIcon } from "@radix-ui/react-icons";

const Navbar = () => {
  const user = auth.currentUser;
  const router = useRouter();
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
    <div className="sticky top-0 z-50 pt-3 px-4">
      <div className=" bg-opacity-20  backdrop-filter backdrop-blur-lg py-2">
        <div className="container flex justify-between px-2 items-center">
          <Link href="/dashboard">
            <div className="flex items-center justify-center text-lg cursor-pointer">
              <img src="/fullimage.png" className="w-36 ml-3" alt="Logo" />
            </div>
          </Link>

          <div className="flex items-center gap-5">
            {/* <Button variant="outline" onClick={() => router.push("/dashboard")}>
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
  );
};

export default Navbar;
