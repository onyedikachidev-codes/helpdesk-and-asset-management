"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type ActionState = {
  error?: string;
  success?: string;
};

// --- Helper function for security ---
async function isAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin";
}

// --- Create New User ---
export async function createUser(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!(await isAdmin())) {
    return {
      error: "Unauthorized: You do not have permission to create users.",
    };
  }

  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  const role = formData.get("role") as string;
  const jobTitle = formData.get("job_title") as string;
  const department = formData.get("department") as string;

  if (!email || !password || !fullName || !role) {
    return { error: "Email, Password, Full Name, and Role are required." };
  }

  // 1. Create the user in the auth system. The trigger will fire here.
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the email
    });

  if (authError) {
    console.error("Auth Create Error:", authError);
    return { error: `Could not create user: ${authError.message}` };
  }

  // 2. FIX: Instead of inserting, UPDATE the profile that the trigger created.
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      role,
      job_title: jobTitle || null,
      department: department || null,
    })
    .eq("id", authData.user.id); // Target the new user's ID

  if (profileError) {
    console.error("Profile Update Error:", profileError);
    // If the update fails, we should still clean up the auth user.
    await supabase.auth.admin.deleteUser(authData.user.id);
    return { error: "Could not update the newly created user profile." };
  }

  revalidatePath("/dashboard/user-management");
  return { success: "User created successfully!" };
}

// --- Update User's Profile ---
export async function updateUserProfile(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!(await isAdmin())) return { error: "Unauthorized." };

  const supabase = await createClient();
  const userId = formData.get("user_id") as string;
  const fullName = formData.get("full_name") as string;
  const jobTitle = formData.get("job_title") as string;
  const department = formData.get("department") as string;

  if (!userId || !fullName) {
    return { error: "User ID and Full Name are required." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      job_title: jobTitle,
      department: department,
    })
    .eq("id", userId);

  if (error) {
    console.error("Update Profile Error:", error);
    return { error: "Database error: Could not update profile." };
  }

  revalidatePath("/dashboard/user-management");
  return { success: "Profile updated." };
}

// --- Update User's Role ---
export async function manageUserRole(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!(await isAdmin())) return { error: "Unauthorized." };

  const supabase = await createClient();
  const userId = formData.get("user_id") as string;
  const newRole = formData.get("role") as "it_staff" | "employee";

  if (!userId || !newRole) return { error: "Missing required fields." };

  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  if (error) return { error: "Database error: Could not update role." };

  revalidatePath("/dashboard/user-management");
  return { success: "User role updated." };
}

// --- Deactivate / Reactivate User Account ---
export async function toggleUserStatus(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!(await isAdmin())) return { error: "Unauthorized." };

  const supabase = await createClient();
  const userId = formData.get("user_id") as string;
  const currentStatus = formData.get("is_active") === "true";

  if (!userId) return { error: "Missing user ID." };

  const newStatus = !currentStatus;
  const { error } = await supabase
    .from("profiles")
    .update({ is_active: newStatus })
    .eq("id", userId);

  if (error) return { error: "Database error: Could not update status." };

  revalidatePath("/dashboard/user-management");
  return {
    success: `User has been ${newStatus ? "activated" : "deactivated"}.`,
  };
}
