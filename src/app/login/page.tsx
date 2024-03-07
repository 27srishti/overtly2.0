import Link from "next/link";
import styles from "./styles.module.css";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/app/login/user-auth-form";
import { ModeToggle } from "@/components/ModeToggle";
import Image from "next/image";

export default function AuthenticationPage() {
  return (
    <div className={`grid grid-cols-2 ${styles.grd}`}>
      <div
        className={`flex h-screen bg-[url('/login.jpg')] bg-no-repeat bg-center ${styles.im}`}
      >
        <div className="relative  h-full flex-col  p-10  flex bold">
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
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
            </svg>
            <div>Public relation</div>
          </div>
        </div>
      </div>
      <div className={`flex ${styles.sig}`}>
        <div className="absolute right-4 top-4 md:right-8 md:top-8 flex items-center">
          {/* <ModeToggle /> */}
          {/* <Link
            href="/signup"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Sign in
          </Link> */}
        </div>
        <div
          className={`mx-auto flex w-full flex-col justify-center space-y-6  ${styles.w}`}
        >
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Log in to Public relation
            </h1>
            <p className="text-sm text-muted-foreground">
              Choose any of the auth providers
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground text-w">
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
          </p>
        </div>
      </div>
    </div>
  );
}
