"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type ActionState = {
  error?: string;
  success?: string;
};

// Action to assign a ticket to the currently logged-in user
export async function assignTicketToSelf(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to perform this action." };
  }

  const ticketId = parseInt(formData.get("ticketId") as string, 10);
  if (isNaN(ticketId)) {
    return { error: "Invalid Ticket ID." };
  }

  const { error } = await supabase
    .from("tickets")
    .update({ assigned_to: user.id, status: "In Progress" })
    .eq("id", ticketId);

  if (error) {
    console.error("Supabase assignment error:", error);
    return { error: "Database error: Could not assign ticket." };
  }

  revalidatePath("/dashboard/ticket-queue");
  return { success: "Ticket successfully assigned to you." };
}

// Action to assign a ticket to a specific user
export async function assignTicketToUser(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const ticketId = parseInt(formData.get("ticketId") as string, 10);
  const assigneeId = formData.get("assigneeId") as string;

  if (isNaN(ticketId) || !assigneeId) {
    return { error: "Invalid data provided." };
  }

  const { error } = await supabase
    .from("tickets")
    .update({ assigned_to: assigneeId, status: "In Progress" })
    .eq("id", ticketId);

  if (error) {
    console.error("Supabase assignment error:", error);
    return { error: "Database error: Could not assign ticket." };
  }

  revalidatePath("/dashboard/ticket-queue");
  return { success: "Ticket successfully assigned." };
}

// Action to update ticket status from the queue
export async function updateTicketStatusFromQueue(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const ticketId = parseInt(formData.get("ticketId") as string, 10);
  const status = formData.get("status") as string;

  if (isNaN(ticketId) || !status) {
    return { error: "Invalid data provided." };
  }

  const { error } = await supabase
    .from("tickets")
    .update({ status: status })
    .eq("id", ticketId);

  if (error) {
    console.error("Supabase status update error:", error);
    return { error: "Database error: Could not update status." };
  }

  revalidatePath("/dashboard/ticket-queue");
  return { success: "Ticket status updated." };
}
