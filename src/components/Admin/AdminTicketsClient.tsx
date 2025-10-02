"use client";

import { useState, FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TableCell, TableRow } from "@/components/ui/table";
import Pagination from "@/components/Pagination";
import ReusuableTable from "@/components/ReusableTable";
import SortDropdown from "@/components/SortDropdown";
import StatusSpan from "@/components/ui/StatusSpan";
import StatusFilter from "@/components/StatusFilter";
import { baseClassName } from "@/constants/index";
import type {
  AdminTicket,
  ITStaffMember,
} from "@/app/dashboard/tickets/admin/page";
import AdminTicketModal from "./AdminTicketModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type AdminTicketsClientProps = {
  initialTickets: AdminTicket[];
  totalTickets: number;
  itStaffList: ITStaffMember[];
  currentPage: number;
  itemsPerPage: number;
};

const tableHeaders = [
  { title: "Ticket Id" },
  { title: "Title" },
  { title: "Status" },
  { title: "Created By" },
  { title: "Assigned To" },
  { title: "Last Updated" },
];

export default function AdminTicketsClient({
  initialTickets,
  totalTickets,
  itStaffList,
  currentPage,
  itemsPerPage,
}: AdminTicketsClientProps) {
  const [selectedTicket, setSelectedTicket] = useState<AdminTicket | null>(
    null
  );
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") || "";

  const totalPages = Math.ceil(totalTickets / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleEntriesChange = (newLimit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", String(newLimit));
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get("q") as string;
    const params = new URLSearchParams(searchParams);
    params.set("q", searchQuery);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="flex items-center justify-between mx-6 pt-6">
        <h2 className="text-lg font-semibold ">All System Tickets</h2>
        <div className="flex items-center gap-4">
          <StatusFilter />
          <SortDropdown />
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 w-full"
          >
            <Input
              name="q"
              placeholder="Search by ticket title..."
              className="flex-grow border border-gray-300"
              defaultValue={currentQuery}
            />
            <Button
              type="submit"
              className="bg-purple-800 hover:bg-purple-700 cursor-pointer"
            >
              Search
            </Button>
          </form>
        </div>
      </div>

      <div className="mx-6 pt-4 pb-10 space-y-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalEntries={totalTickets}
          entriesPerPage={itemsPerPage}
          onNext={() => handlePageChange(currentPage + 1)}
          onPrev={() => handlePageChange(currentPage - 1)}
          className="bg-white py-3.5 px-5"
          onEntriesChange={handleEntriesChange}
        />
        <ReusuableTable
          headers={tableHeaders}
          data={initialTickets}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          totalItems={totalTickets}
          renderRow={(ticket) => (
            <TableRow
              key={ticket.id}
              className="odd:bg-[#f8f8fc] cursor-pointer hover:bg-gray-100"
              onClick={() => setSelectedTicket(ticket)}
            >
              <TableCell className={baseClassName}>TIX-00{ticket.id}</TableCell>
              <TableCell className={baseClassName}>{ticket.title}</TableCell>
              <TableCell className={baseClassName}>
                <StatusSpan status={ticket.status}>{ticket.status}</StatusSpan>
              </TableCell>
              <TableCell className={baseClassName}>
                {ticket.creator?.full_name ?? "N/A"}
              </TableCell>
              <TableCell className={baseClassName}>
                {ticket.assignee?.full_name ?? (
                  <span className="text-red-500 font-semibold">Unassigned</span>
                )}
              </TableCell>
              <TableCell className={baseClassName}>
                {new Date(ticket.updated_at).toLocaleString()}
              </TableCell>
            </TableRow>
          )}
        />
      </div>

      <AdminTicketModal
        ticket={selectedTicket}
        itStaffList={itStaffList}
        onClose={() => setSelectedTicket(null)}
      />
    </>
  );
}
