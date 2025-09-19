import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { Database } from "../database.types";

export const createClient = async (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Pass the entire cookie object to the set method
          cookiesToSet.forEach((cookie) => request.cookies.set(cookie));
          response = NextResponse.next({
            request,
          });
          // Also pass the entire cookie object here
          cookiesToSet.forEach((cookie) => response.cookies.set(cookie));
        },
      },
    }
  );

  return { supabase, response };
};
