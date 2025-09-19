"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
  // We already know the client works from our test page.
  const supabase = await createClient();

  // Let's be very explicit with the form data.
  const data = Object.fromEntries(formData.entries());

  const email = String(data.email);
  const password = String(data.password);
  const fullName = String(data.fullName);
  const role = String(data.role);

  // The rest of the logic is the same, but now we're using
  // these clean variables.
  if (!["employee", "it_staff"].includes(role)) {
    return redirect("/signup?message=Invalid role selected");
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
    // This is the error we've been seeing.
    console.error("Signup Error:", error.message);
    return redirect("/signup?message=Could not create account");
  }

  // If signup succeeds, go to the login page.
  return redirect(
    "/auth/login?message=Account created successfully. Please log in."
  );
}
