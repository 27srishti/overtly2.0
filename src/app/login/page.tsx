import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/app/login/user-auth-form";
import { ModeToggle } from "@/components/ModeToggle";
import Image from "next/image";

export default function AuthenticationPage() {
  return (
    <div className={`grid grid-cols-2 gradientbg font-montserrat`}>
      <div className={`flex h-screen bg-no-repeat bg-center`}>
        <div className="relative  h-full flex-col  p-10  flex bold">
          <div className="relative z-20 flex items-center text-lg font-medium">
            <img src="fullimage.png" alt="logo" className="w-24" />
          </div>
        </div>
      </div>
      <div className={`flex py-14 px-24 text-[#545454]`}>
        <div
          className={`mx-auto flex w-full flex-col justify-center space-y-6 bg-white shadow-md rounded-[70px] p-14 text`}
        >
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight ">
              Login to Overtly
            </h1>
            <p className="text-sm text-muted-foreground">
              Choose any of the auth providers
            </p>
          </div>
          <UserAuthForm />

          <div className="px-8 text-center text-sm text-muted-foreground text-w">
            Already have a accound ? &nbsp;
            <Link
              href="/signup"
              className={`${cn(
                buttonVariants({ variant: "ghost" })
              )}  underline underline-offset-4 hover:text-primary`}
            >
              Sign in
            </Link>
          </div>

          <div className="px-8 text-center text-sm text-muted-foreground text-w">
            By clicking continue, you agree to our&nbsp;
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service&nbsp;
            </Link>
            and&nbsp;
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
