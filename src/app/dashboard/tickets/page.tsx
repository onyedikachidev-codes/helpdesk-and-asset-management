import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TicketsClient from "@/components/TicketsClient";

export type Ticket = {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  status: string;
};

export default async function TicketsPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    limit?: string;
    q?: string;
    status?: string;
    sort?: string; // 1. Added 'sort' to the expected params
  };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = Number(searchParams?.limit) || 10;
  const query = searchParams?.q || "";
  const status = searchParams?.status;
  const sort = searchParams?.sort || "newest";

  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  let queryBuilder = supabase
    .from("tickets")
    .select("id, title, description, status, created_at, updated_at", {
      count: "exact",
    })
    .eq("created_by", user.id);

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
    .returns<Ticket[]>();

  const totalTickets = count ?? 0;

  if (error) {
    console.error("Error fetching tickets:", error);
  }

  return (
    <TicketsClient
      initialTickets={tickets ?? []}
      totalTickets={totalTickets}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
    />
  );
}
