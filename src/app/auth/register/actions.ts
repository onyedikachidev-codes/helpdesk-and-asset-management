"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function signup(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const origin = (await headers()).get("origin");
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  const role = "employee";

  if (!email || !password || !fullName) {
    return { error: "Please fill in all required fields." };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: origin ? `${origin}/auth/callback` : undefined,
      data: {
        full_name: fullName,
        role: role,
      },
    },
  });

  if (error) {
    console.error("Signup Error:", error.message);
    return { error: error.message };
  }

  return { success: true };
}
