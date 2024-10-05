import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest, response: NextResponse) {
  const session = request.cookies.get("session");

  // Protect the dashboard route
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      const responseAPI = await fetch(`http://127.0.0.1:3000/api/login`, {
        headers: {
          Cookie: `session=${session?.value}`,
        },
      });

      if (responseAPI.status !== 200) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error("Error fetching login status:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Handle login, signup, and homepage redirects
  if (['/login', '/signup', '/'].includes(request.nextUrl.pathname)) {
    if (session) {
      try {
        const responseAPI = await fetch(`http://127.0.0.1:3000/api/login`, {
          headers: {
            Cookie: `session=${session?.value}`,
          },
        });

        if (responseAPI.status === 200) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } catch (error) {
        console.error("Error fetching login status for redirect:", error);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/"],
};
