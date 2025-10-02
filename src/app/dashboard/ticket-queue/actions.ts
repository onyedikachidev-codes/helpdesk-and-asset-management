"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { User } from "@supabase/supabase-js";

type ActionState = { error?: string; success?: string };

async function verifyRole(
  allowedRoles: string[]
): Promise<{ user: User | null; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, error: "You must be logged in." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const userRole = profile?.role?.toLowerCase() ?? "";

  if (!allowedRoles.map((r) => r.toLowerCase()).includes(userRole)) {
    return {
      user: null,
      error: `Permission Denied: Requires one of the following roles: ${allowedRoles.join(
        ", "
      )}.`,
    };
  }
  return { user, error: null };
}

export async function assignTicketToSelf(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { user, error: authError } = await verifyRole(["it_staff", "admin"]);
  if (authError || !user)
    return { error: authError ?? "Authentication failed." };

  const supabase = await createClient();
  const ticketId = parseInt(formData.get("ticketId") as string, 10);
  if (isNaN(ticketId)) return { error: "Invalid ticket ID." };

  const { error } = await supabase
    .from("tickets")
    .update({ assigned_to: user.id, status: "In Progress" })
    .eq("id", ticketId);
  if (error) return { error: "Could not assign ticket to self." };

  revalidatePath("/dashboard/ticket-queue");
  revalidatePath("/dashboard/tickets/it_staff");
  return { success: "Ticket assigned to you." };
}

export async function assignTicketToUser(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { user, error: authError } = await verifyRole(["it_staff", "admin"]);
  if (authError || !user)
    return { error: authError ?? "Authentication failed." };

  const supabase = await createClient();
  const ticketId = parseInt(formData.get("ticketId") as string, 10);
  const assigneeId = formData.get("assigneeId") as string;
  if (isNaN(ticketId) || !assigneeId)
    return { error: "Invalid ticket or assignee." };

  const { error } = await supabase
    .from("tickets")
    .update({ assigned_to: assigneeId, status: "In Progress" })
    .eq("id", ticketId);
  if (error) return { error: "Database error: Could not assign ticket." };

  revalidatePath("/dashboard/ticket-queue");
  return { success: "Ticket assigned." };
}

export async function updateTicketDetails(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { user, error: authError } = await verifyRole(["admin"]);
  if (authError || !user)
    return { error: authError ?? "Authentication failed." };

  const supabase = await createClient();
  const ticketId = parseInt(formData.get("ticketId") as string, 10);
  const updatedData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    priority: formData.get("priority") as string,
  };

  if (isNaN(ticketId) || !updatedData.title)
    return { error: "Ticket ID and title are required." };

  const { error } = await supabase
    .from("tickets")
    .update(updatedData)
    .eq("id", ticketId);
  if (error) {
    console.error("Admin Edit Error:", error);
    return { error: "Database error: Could not update ticket." };
  }

  revalidatePath("/dashboard/ticket-queue");
  return { success: "Ticket details updated." };
}

export async function deleteTicket(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { user, error: authError } = await verifyRole(["admin"]);
  if (authError || !user)
    return { error: authError ?? "Authentication failed." };

  const supabase = await createClient();
  const ticketId = parseInt(formData.get("ticketId") as string, 10);
  if (isNaN(ticketId)) return { error: "Invalid Ticket ID." };

  const { error } = await supabase.from("tickets").delete().eq("id", ticketId);
  if (error) {
    console.error("Admin Delete Error:", error);
    return { error: "Database error: Could not delete ticket." };
  }

  revalidatePath("/dashboard/ticket-queue");
  return { success: "Ticket has been deleted." };
}

export async function deleteSelectedTickets(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { user, error: authError } = await verifyRole(["admin"]);
  if (authError || !user)
    return { error: authError ?? "Authentication failed." };

  const supabase = await createClient();
  const ticketIdsJSON = formData.get("ticketIds") as string;

  if (!ticketIdsJSON) {
    return { error: "No tickets selected." };
  }

  const ticketIds = JSON.parse(ticketIdsJSON);

  if (!Array.isArray(ticketIds) || ticketIds.length === 0) {
    return { error: "Invalid selection." };
  }

  const { error } = await supabase.from("tickets").delete().in("id", ticketIds);

  if (error) {
    console.error("Admin Bulk Delete Error:", error);
    return { error: "Database error: Could not delete selected tickets." };
  }

  revalidatePath("/dashboard/ticket-queue");
  return { success: `${ticketIds.length} ticket(s) have been deleted.` };
}
