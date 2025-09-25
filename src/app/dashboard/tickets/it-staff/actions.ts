"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Define possible ticket statuses
const TICKET_STATUSES = ["Open", "In Progress", "Resolved"];

// Define the shape of the state object for the form action
type ActionState = {
  error?: string | null;
  success?: string | null;
};

export async function updateTicketStatus(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  // 1. Authenticate and get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    // This should ideally be handled by page-level security, but it's good practice
    return { error: "User not authenticated." };
  }

  // 2. Get form data and convert ticketId to a number
  const ticketIdString = formData.get("ticketId") as string;
  const newStatus = formData.get("newStatus") as string;
  const ticketId = parseInt(ticketIdString, 10);

  // 3. Validate input
  if (isNaN(ticketId)) {
    return { error: "Invalid ticket ID." };
  }
  if (!newStatus) {
    return { error: "Missing new status." };
  }
  if (!TICKET_STATUSES.includes(newStatus)) {
    return { error: "Invalid status value provided." };
  }

  // 4. Update the ticket in the database
  const { error } = await supabase
    .from("tickets")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", ticketId) // Use the numeric ticketId here
    .eq("assigned_to", user.id); // SECURITY: Ensure they own the ticket

  if (error) {
    console.error("Error updating ticket status:", error);
    return { error: "Database error: Could not update ticket status." };
  }

  // 5. Revalidate the path to show the updated data
  revalidatePath("/it-staff/my-tickets");

  // 6. Return success message
  return { success: "Ticket status updated successfully." };
}
