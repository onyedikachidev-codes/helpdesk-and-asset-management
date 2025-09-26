"use server";

import { createClient } from "@/lib/supabase/server";

// The shape of the state object passed between the client and server.
type ActionState = {
  error?: string;
  success?: boolean;
};

// FIX: The function now accepts `prevState` as its first argument
// to correctly match the signature expected by `useActionState`.
export async function signup(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
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
