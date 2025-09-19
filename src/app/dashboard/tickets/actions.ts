"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTicket(formData: FormData) {
  const supabase = await createClient();

  // 1. Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  // 2. Get the form data
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const priority = formData.get("priority") as string;

  // 3. Insert the new ticket into the database
  const { error } = await supabase.from("tickets").insert({
    title,
    description,
    category,
    priority,
    status: "Open",
    created_by: user.id,
  });

  if (error) {
    // Handle potential errors, e.g., return a message
    console.error("Error creating ticket:", error);
    return redirect("/tickets?message=Could not create ticket");
  }

  // 4. On success, revalidate the paths where tickets are displayed
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tickets");

  // 5. Redirect the user to their tickets page
  return redirect("/dashboard/tickets");
}
