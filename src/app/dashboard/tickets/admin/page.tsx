import AdminTicketsClient from "@/components/Admin/AdminTicketsClient";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type AdminTicket = {
  id: number;
  title: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  creator: { full_name: string | null } | null;
  assignee: { full_name: string | null } | null;
};

// Define the shape of an IT Staff member for the assignment dropdown
export type ITStaffMember = {
  id: string;
  full_name: string | null;
};

export default async function AdminAllTicketsPage({
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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all IT Staff members to populate the assignment dropdown in the modal
  const { data: itStaffList } = await supabase
    .from("profiles")
    .select("id, full_name")
    .ilike("role", "it_staff")
    .returns<ITStaffMember[]>();

  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = Number(searchParams?.limit) || 10;
  const query = searchParams?.q || "";
  const status = searchParams?.status;
  const sort = searchParams?.sort || "newest";

  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  let queryBuilder = supabase.from("tickets").select(
    `
      id, title, status, priority, created_at, updated_at,
      creator:profiles!tickets_created_by_fkey(full_name),
      assignee:profiles!tickets_assigned_to_fkey(full_name)
      `,
    { count: "exact" }
  );

  if (query) {
    queryBuilder = queryBuilder.ilike("title", `%${query}%`);
  }
  if (status && status !== "All") {
    queryBuilder = queryBuilder.eq("status", status);
  }

  let sortColumn = "created_at";
  let sortDirection = false;
  if (sort === "oldest") {
    sortColumn = "created_at";
    sortDirection = true;
  } else if (sort === "updated") {
    sortColumn = "updated_at";
    sortDirection = false;
  }

  const {
    data: tickets,
    error,
    count,
  } = await queryBuilder
    .order(sortColumn, { ascending: sortDirection })
    .range(from, to)
    .returns<AdminTicket[]>();

  if (error) {
    console.error("Error fetching all tickets:", error);
  }

  return (
    <AdminTicketsClient
      initialTickets={tickets ?? []}
      totalTickets={count ?? 0}
      itStaffList={itStaffList ?? []}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
    />
  );
}
