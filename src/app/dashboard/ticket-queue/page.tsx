import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TicketQueueClient from "@/components/TicketQueueClient";

// Force dynamic rendering to ensure the queue is always up-to-date
export const dynamic = "force-dynamic";

export type QueueTicket = {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  status: string;
  creator: {
    full_name: string | null;
  } | null;
  assignee: {
    full_name: string | null;
  } | null;
};

export type ITStaffMember = {
  id: string;
  full_name: string | null;
};

export default async function TicketQueuePage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    limit?: string;
    q?: string;
    sort?: string;
  };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // --- 1. Fetch all tickets for the queue view ---
  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = Number(searchParams?.limit) || 10;
  const query = searchParams?.q || "";
  const sort = searchParams?.sort || "newest";

  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  let queryBuilder = supabase.from("tickets").select(
    `
      id, title, status, created_at, updated_at,
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

  // --- 2. Fetch the count of unassigned tickets ---
  const { count: unassignedCount, error: countError } = await supabase
    .from("tickets")
    .select("id", { count: "exact", head: true })
    .is("assigned_to", null);

  // --- 3. Fetch the list of all IT staff members for assignment ---
  const { data: itStaffList, error: staffError } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "IT_STAFF") // This assumes you have a 'role' column
    .returns<ITStaffMember[]>();

  if (ticketsError || countError || staffError) {
    console.error("Error fetching ticket queue data:", {
      ticketsError,
      countError,
      staffError,
    });
  }

  return (
    <TicketQueueClient
      initialTickets={tickets ?? []}
      totalTickets={count ?? 0}
      unassignedCount={unassignedCount ?? 0}
      itStaffList={itStaffList ?? []}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
    />
  );
}
