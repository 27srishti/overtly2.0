import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session");

  // Set origin based on environment or fallback to request origin
  const origin =
    process.env.APPLICATION_URL
      ? `https://${process.env.APPLICATION_URL}`
      : request.nextUrl.origin;

  // Check if the user is accessing the dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      // Redirect to home if there's no session
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      // Validate the session using the internal API
      const responseAPI = await fetch(`${origin}/api/login`, {
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
      console.log("Session Value:", session?.value);
      console.log("Origin:", origin);
      console.log("Request URL:", request.url);
      console.log("Client Email (from env):", process.env.clientEmail);
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
      const responseAPI = await fetch(`${origin}/api/login`, {
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
      console.log("Session Value:", session?.value);
      console.log("Origin:", origin);
      console.log("Request URL:", request.url);
    }
  }

  // Proceed to the next middleware if no redirects were made
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/"],
};
