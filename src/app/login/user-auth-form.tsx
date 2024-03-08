"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase/firebase";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [Email, setEmail] = useState<string>("");
  const [Password, setPassword] = useState<string>("");

  async function signInWithProvider(provider: any) {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        const userRef = doc(db, "users", result.user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          await setDoc(userRef, {
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          });
          console.log("User account created");
        } else {
          console.log("User already exists");
        }
        console.log(result.user);
        await fetch("/api/login", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${await result.user.getIdToken()}`,
          },
        }).then(() => {
          toast({
            description: "Login Sucessfull",
          });
          router.push("/dashboard");
          setIsLoading(false);
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    signInWithEmailAndPassword(auth, Email, Password)
      .then(async (result) => {
        await fetch("/api/login", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${await result.user.getIdToken()}`,
          },
        }).then(() => {
          toast({
            description: "Login Sucessfull",
          });
          router.push("/dashboard");
          setIsLoading(false);
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        if (errorCode == "auth/invalid-credential") {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "invalid-credential",
          });
        }
        setIsLoading(false);
      });
  }

  function changePassword() {
    sendPasswordResetEmail(auth, Email)
      .then(() => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "password reset link sent",
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        if (errorCode == "auth/missing-email") {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "missing-email",
          });
        }
      });
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoComplete="off"
              disabled={isLoading}
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id="password"
              placeholder="Password"
              type="password"
              autoComplete="off"
              disabled={isLoading}
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </div>
        <div
          onClick={changePassword}
          className="underline underline-offset-4 hover:text-primary bg-background text-muted-foreground w-full text-center text-sm mt-2"
        >
          Forgot Password ?
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>

        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        onClick={() => signInWithProvider(new GoogleAuthProvider())}
        disabled={isLoading}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
    </div>
  );
}
