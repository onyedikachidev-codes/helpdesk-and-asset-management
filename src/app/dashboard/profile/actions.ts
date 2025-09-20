"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateUserProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const updatedProfile = {
    phone_number: formData.get("phone_number") as string,
    office_location: formData.get("office_location") as string,
    receive_notifications: formData.get("receive_notifications") === "on",
  };

  const { error } = await supabase
    .from("profiles")
    .update(updatedProfile)
    .eq("id", user.id);

  if (error) {
    console.error("Error updating profile:", error);
    // You could redirect to an error page here
    return;
  }

  // Revalidate the path to ensure the page shows the updated data
  revalidatePath("/dashboard/profile");
}

// Add this new function to the file
export async function updateAvatarUrl(filePath: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: filePath })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating avatar URL:", error);
    // We'll throw the error so the client component knows it failed
    throw new Error("Could not update avatar URL.");
  }

  // Revalidate the path to refresh the UI
  revalidatePath("/dashboard/profile");
}
