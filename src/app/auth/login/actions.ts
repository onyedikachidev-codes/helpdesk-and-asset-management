"use server";

import { createClient } from "@/lib/supabase/server";
// No longer need redirect, but we might need revalidatePath later
import { revalidatePath } from "next/cache"; 

// The function will now return a promise with a specific shape
export async function login(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login Error:", error.message);
    // Return an error object
    return { error: "Could not authenticate user" };
  }
  
  // On success, revalidate the path and return a success object
  revalidatePath("/", "layout");
  return { success: true };
}