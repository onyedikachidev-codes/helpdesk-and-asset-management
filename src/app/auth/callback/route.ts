import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// This is a route handler that runs on the server.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // The exchange was successful, and the auth cookie is now set.
      // Redirect to the intended page (e.g., /auth/update-password).
      // The type of "next" is being checked to prevent open redirect vulnerabilities.
      if (next.startsWith("/")) {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
