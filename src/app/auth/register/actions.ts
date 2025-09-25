"use server";

import { createClient } from "@/lib/supabase/server";

export async function signup(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
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
      // The `emailRedirectTo` option has been removed.
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
