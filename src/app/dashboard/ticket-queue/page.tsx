import TicketQueueClient from "@/components/TicketQueueClient";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export type QueueTicket = {
  id: number;
  title: string;
  description: string; // Needed for the edit form
  created_at: string;
  updated_at: string;
  status: string;
  priority: string; // Needed for the edit form
  category: string; // Needed for the edit form
  creator: { full_name: string | null } | null;
  assignee: { full_name: string | null } | null;
};

export type ITStaffMember = { id: string; full_name: string | null };
// Added types for categories and priorities for the admin edit modal
export type TicketCategory = { name: string };
export type TicketPriority = { name: string };

export default async function TicketQueuePage({
  searchParams,
}: {
  searchParams?: { page?: string; limit?: string; q?: string; sort?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 1. Fetch the user's role to pass down to the client
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const userRole = profile?.role ?? "employee";

  // 2. Fetch all necessary data in parallel for efficiency
  const [itStaffListRes, categoriesRes, prioritiesRes] = await Promise.all([
    supabase.from("profiles").select("id, full_name").ilike("role", "it_staff"),
    supabase.from("ticket_categories").select("name"),
    supabase.from("ticket_priorities").select("name"),
  ]);

  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = Number(searchParams?.limit) || 10;
  const query = searchParams?.q || "";
  const sort = searchParams?.sort || "newest";

  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  // 3. Fetch extra ticket details needed for the edit form
  let queryBuilder = supabase.from("tickets").select(
    `
      id, title, description, status, priority, category, created_at, updated_at,
      creator:profiles!tickets_created_by_fkey(full_name),
      assignee:profiles!tickets_assigned_to_fkey(full_name)
    `,
    { count: "exact" }
  );

  if (query) {
    queryBuilder = queryBuilder.ilike("title", `%${query}%`);
  }
  let sortColumn = "created_at";
  let sortDirection = false;
  if (sort === "oldest") sortDirection = true;
  if (sort === "updated") sortColumn = "updated_at";

  const {
    data: tickets,
    error: ticketsError,
    count,
  } = await queryBuilder
    .order(sortColumn, { ascending: sortDirection })
    .range(from, to)
    .returns<QueueTicket[]>();

  const { count: unassignedCount, error: countError } = await supabase
    .from("tickets")
    .select("id", { count: "exact", head: true })
    .is("assigned_to", null);

  if (ticketsError || countError) {
    console.error("Error fetching ticket queue data:", {
      ticketsError,
      countError,
    });
  }

  return (
    <TicketQueueClient
      initialTickets={tickets ?? []}
      totalTickets={count ?? 0}
      unassignedCount={unassignedCount ?? 0}
      itStaffList={itStaffListRes.data ?? []}
      categories={categoriesRes.data ?? []}
      priorities={prioritiesRes.data ?? []}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      userRole={userRole}
    />
  );
}
