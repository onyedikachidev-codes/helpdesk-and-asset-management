import ITStaffTicketsClient from "@/components/IT_STAFF/ITStaffTicketsClient";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// Define the Ticket type, assuming it might have more fields for IT staff
export type ITStaffTicket = {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  status: string;
  priority: string;
  category: string;
  // It's useful to know who created the ticket
  created_by: {
    full_name: string; // UPDATED: Changed from 'email' to 'full_name'
  } | null; // Allow created_by to be null if profile doesn't exist
};

export default async function ITStaffMyTicketsPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    limit?: string;
    q?: string;
    status?: string;
    sort?: string;
  };
}) {
  console.log("Server received searchParams:", searchParams);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = Number(searchParams?.limit) || 10;
  const query = searchParams?.q || "";
  const status = searchParams?.status;
  const sort = searchParams?.sort || "newest";

  console.log(`Filtering by status: '${status}'`);

  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  // 1. Build the query for the 'tickets' table
  let queryBuilder = supabase
    .from("tickets")
    .select(
      `
      id, 
      title, 
      description, 
      status, 
      priority,
      category,
      created_at, 
      updated_at,
      created_by:profiles!tickets_created_by_fkey(full_name)
    `, // CORRECTED LINE: Fetch 'full_name' instead of 'email'
      {
        count: "exact",
      }
    )
    // 2. Filter by 'assigned_to' instead of 'created_by'
    .eq("assigned_to", user.id);

  // Apply search query if it exists
  if (query) {
    queryBuilder = queryBuilder.ilike("title", `%${query}%`);
  }

  // Apply status filter if it exists and is not 'All'
  if (status && status !== "All") {
    console.log("Applying status filter to the query...");
    queryBuilder = queryBuilder.eq("status", status);
  }

  // Determine sorting column and direction
  let sortColumn = "created_at";
  let sortDirection = false; // descending for newest

  if (sort === "oldest") {
    sortColumn = "created_at";
    sortDirection = true; // ascending
  } else if (sort === "updated") {
    sortColumn = "updated_at";
    sortDirection = false; // descending
  }

  // 3. Execute the final query
  const {
    data: tickets,
    error,
    count,
  } = await queryBuilder
    .order(sortColumn, { ascending: sortDirection })
    .range(from, to)
    .returns<ITStaffTicket[]>();

  const totalTickets = count ?? 0;

  if (error) {
    console.error("Error fetching assigned tickets:", error);
  }

  // 4. Pass the fetched data to the new client component
  return (
    <ITStaffTicketsClient
      initialTickets={tickets ?? []}
      totalTickets={totalTickets}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
    />
  );
}
