import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session");

  // Check if the user is accessing the dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      // Redirect to home if there's no session
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      // Validate the session using the internal API
      const responseAPI = await fetch(`${request.nextUrl.origin}/api/login`, {
        headers: {
          Cookie: `session=${session?.value}`,
        },
      });

      if (responseAPI.status !== 200) {
        // Redirect to home if session validation fails
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error("Error during session validation:", error);
      console.log(session?.value);
      console.log(request.nextUrl.origin);
      console.log(request.url);
      console.log(process.env.clientEmail);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Handle redirection for login, signup, or home if the user is already logged in
  if (
    ["/login", "/signup", "/"].includes(request.nextUrl.pathname) &&
    session
  ) {
    try {
      // Validate the session using the internal API
      const responseAPI = await fetch(`${request.nextUrl.origin}/api/login`, {
        headers: {
          Cookie: `session=${session?.value}`,
        },
      });

      if (responseAPI.status === 200) {
        // Redirect to dashboard if already logged in
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      console.error("Error during session validation:", error);
      console.log(session?.value);
      console.log(request.nextUrl.origin);
      console.log(request.url);
    }
  }

  // Proceed to the next middleware if no redirects were made
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/"],
};
