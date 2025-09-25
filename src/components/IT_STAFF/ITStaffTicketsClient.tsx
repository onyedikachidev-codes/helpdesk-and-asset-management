"use client";

import { useState, FormEvent } from "react";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/Pagination";
import ReusuableTable from "@/components/ReusableTable";
import { TableCell, TableRow } from "@/components/ui/table";
import { baseClassName } from "@/constants/index";
import StatusSpan from "@/components/ui/StatusSpan";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import ITStaffTicketDetailsModal from "./ITStaffTicketDetailsModal"; // The new, enhanced modal
import { ITStaffTicket } from "@/app/dashboard/tickets/it-staff/page";
import { Input } from "../ui/input";
import SortDropdown from "../SortDropdown";
import { Button } from "../ui/button";

type ITStaffTicketsClientProps = {
  initialTickets: ITStaffTicket[];
  totalTickets: number;
  currentPage: number;
  itemsPerPage: number;
};

// Updated table headers for the IT staff view
const tableHeaders = [
  { title: "Ticket Id" },
  { title: "Title" },
  { title: "Submitted By" },
  { title: "Status" },
  { title: "Priority" },
  { title: "Last Updated" },
];

export default function ITStaffTicketsClient({
  initialTickets,
  totalTickets,
  currentPage,
  itemsPerPage,
}: ITStaffTicketsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") || "";

  const [selectedTicket, setSelectedTicket] = useState<ITStaffTicket | null>(
    null
  );

  const totalPages = Math.ceil(totalTickets / itemsPerPage);

  // Helper function to update URL search params
  const updateSearchParams = (paramsToUpdate: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(paramsToUpdate).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    updateSearchParams({ page: String(newPage) });
  };

  const handleEntriesChange = (newLimit: number) => {
    updateSearchParams({ limit: String(newLimit), page: "1" });
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get("q") as string;
    updateSearchParams({ q: searchQuery, page: "1" });
  };

  if (totalTickets === 0 && !currentQuery)
    return <EmptyState title="No Tickets Assigned To You" />;

  return (
    <>
      <div className="flex items-center justify-between mx-6 pt-6">
        <h2 className="text-lg font-semibold ">My Assigned Tickets</h2>
        <div className="flex items-center gap-4">
          <SortDropdown />
          <div className="p-4">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 w-full"
            >
              <Input
                name="q"
                placeholder="Search by ticket title..."
                className="flex-grow border border-blue-600"
                defaultValue={currentQuery}
              />
              <Button
                type="submit"
                className="bg-blue-800 hover:bg-blue-700 cursor-pointer"
              >
                Search
              </Button>
            </form>
          </div>
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
              <TableCell className={`${baseClassName}`}>
                TIX-00{ticket.id}
              </TableCell>
              <TableCell
                className={`${baseClassName} max-w-[30ch] overflow-hidden text-ellipsis whitespace-nowrap`}
              >
                {ticket.title}
              </TableCell>
              <TableCell className={`${baseClassName}`}>
                {ticket.created_by?.full_name || "N/A"}
              </TableCell>
              <TableCell className={`${baseClassName}`}>
                <StatusSpan status={ticket.status}>{ticket.status}</StatusSpan>
              </TableCell>
              <TableCell className={`${baseClassName}`}>
                <StatusSpan status={ticket.priority}>
                  {ticket.priority}
                </StatusSpan>
              </TableCell>
              <TableCell className={`${baseClassName}`}>
                {new Date(ticket.updated_at).toLocaleString()}
              </TableCell>
            </TableRow>
          )}
        />
      </div>

      {/* Use the new, interactive modal for IT Staff */}
      <ITStaffTicketDetailsModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </>
  );
}
