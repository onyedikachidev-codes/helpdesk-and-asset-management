"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

type ActionState = {
  error?: string;
  success?: string;
};

export async function requestPasswordReset(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const origin = (await headers()).get("origin");
  const supabase = await createClient();

  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Please provide your email address." };
  }

  const redirectTo = `${origin}/auth/callback?next=/auth/update-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    console.error("Password Reset Error:", error.message);
    return { error: "Could not send password reset link. Please try again." };
  }

  return {
    success: "Password reset link has been sent to your email address.",
  };
}
