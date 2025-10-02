"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type ActionState = {
  error?: string;
  success?: string;
};

// A helper to verify the user is an admin before performing an action
async function verifyAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role?.toLowerCase() !== "admin") {
    return { error: "Permission Denied: You are not an administrator." };
  }
  return { user };
}

export async function assignTicketToOther(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const authCheck = await verifyAdmin();
  if (authCheck.error) return { error: authCheck.error };

  const supabase = await createClient();
  const ticketId = parseInt(formData.get("ticketId") as string, 10);
  const assigneeId = formData.get("assigneeId") as string;

  if (isNaN(ticketId) || !assigneeId) {
    return { error: "Invalid ticket or assignee selected." };
  }

  const { error } = await supabase
    .from("tickets")
    .update({ assigned_to: assigneeId })
    .eq("id", ticketId);

  if (error) {
    console.error("Admin Assign Error:", error);
    return { error: "Database error: Could not assign ticket." };
  }

  revalidatePath("/dashboard/tickets/admin");
  return { success: "Ticket assigned successfully." };
}

export async function updateTicketStatus(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const authCheck = await verifyAdmin();
  if (authCheck.error) return { error: authCheck.error };

  const supabase = await createClient();
  const ticketId = parseInt(formData.get("ticketId") as string, 10);
  const newStatus = formData.get("newStatus") as string;

  if (isNaN(ticketId) || !newStatus) {
    return { error: "Invalid ticket or status." };
  }

  const { error } = await supabase
    .from("tickets")
    .update({ status: newStatus })
    .eq("id", ticketId);

  if (error) {
    console.error("Admin Status Update Error:", error);
    return { error: "Database error: Could not update status." };
  }

  revalidatePath("/dashboard/tickets/admin");
  return { success: "Ticket status updated." };
}
