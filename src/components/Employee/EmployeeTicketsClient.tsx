"use client";

import { useState, FormEvent } from "react";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/Pagination";
import ReusuableTable from "@/components/ReusableTable";
import { TableCell, TableRow } from "@/components/ui/table";
import { baseClassName } from "@/constants/index";
import StatusSpan from "@/components/ui/StatusSpan";
import CreateTicketModal from "@/components/CreateTicketModal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Ticket } from "@/app/dashboard/tickets/page";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import TicketDetailsModal from "../TicketsDetailsModal";
import SortDropdown from "../SortDropdown";

type TicketsClientProps = {
  initialTickets: Ticket[];
  totalTickets: number;
  currentPage: number;
  itemsPerPage: number;
};

const tableHeaders = [
  { title: "Ticket Id" },
  { title: "Title" },
  { title: "Description" },
  { title: "Created" },
  { title: "Last Updated" },
  { title: "Status" },
];

export default function EmployeeTicketsClient({
  initialTickets,
  totalTickets,
  currentPage,
  itemsPerPage,
}: TicketsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") || "";

  // State to manage the currently selected ticket for the modal
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

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

  if (totalTickets === 0 && !currentQuery)
    return <EmptyState title="No Tickets Found" />;

  return (
    <>
      <div className="flex items-center justify-between mx-6 pt-6">
        <h2 className="text-lg font-semibold ">My Tickets</h2>{" "}
        <div className="flex items-center gap-4">
          <SortDropdown />
          <CreateTicketModal />{" "}
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
              onClick={() => setSelectedTicket(ticket)} // Make row clickable
            >
              <TableCell className={`${baseClassName}`}>
                TIX-00{ticket.id}
              </TableCell>
              <TableCell className={`${baseClassName}`}>
                {ticket.title}
              </TableCell>
              <TableCell
                className={`${baseClassName} max-w-[30ch] overflow-hidden text-ellipsis whitespace-nowrap`}
              >
                {ticket.description}
              </TableCell>
              <TableCell className={`${baseClassName}`}>
                {new Date(ticket.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className={`${baseClassName}`}>
                {new Date(ticket.updated_at).toLocaleDateString()}
              </TableCell>
              <TableCell className={`${baseClassName}`}>
                <StatusSpan status={ticket.status}>{ticket.status}</StatusSpan>
              </TableCell>
            </TableRow>
          )}
        />
      </div>

      {/* The modal is rendered here, controlled by state */}
      <TicketDetailsModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </>
  );
}
