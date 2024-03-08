import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Link href="/login"><Button>Login</Button></Link>
      <Link href="/signup">
        <Button>Sign up</Button>
      </Link>
    </>
  );
}
