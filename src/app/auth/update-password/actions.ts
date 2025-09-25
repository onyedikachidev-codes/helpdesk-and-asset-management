"use server";

import { createClient } from "@/lib/supabase/server";

type ActionState = {
  error?: string;
  success?: string;
};

export async function updatePassword(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error("Update Password Error:", error.message);
    return { error: error.message };
  }

  return { success: "Your password has been updated successfully." };
}
