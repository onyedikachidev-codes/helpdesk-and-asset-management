import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, response } = await createClient(request);

  // This will refresh the session cookie if it's expired.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If the user is not logged in and they are trying to access a protected route...
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    // ...redirect them to the login page.
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If the user is logged in and they are trying to access an auth page (like login/signup)...
  if (user && request.nextUrl.pathname.startsWith("/auth")) {
    // ...redirect them to the dashboard.
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If none of the above, continue as normal.
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
