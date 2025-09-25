"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { RefreshCw } from "lucide-react";
import Pagination from "@/components/Pagination";
import ReusuableTable from "@/components/ReusableTable";
import SortDropdown from "@/components/SortDropdown";
import StatusSpan from "@/components/ui/StatusSpan";
import { baseClassName } from "@/constants/index";
import type {
  QueueTicket,
  ITStaffMember,
} from "@/app/dashboard/ticket-queue/page";
import TicketQueueModal from "./TicketQueueModal";

type TicketQueueClientProps = {
  initialTickets: QueueTicket[];
  totalTickets: number;
  unassignedCount: number;
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

export default function TicketQueueClient({
  initialTickets,
  totalTickets,
  unassignedCount,
  itStaffList,
  currentPage,
  itemsPerPage,
}: TicketQueueClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") || "";

  const [selectedTicket, setSelectedTicket] = useState<QueueTicket | null>(
    null
  );

  const totalPages = Math.ceil(totalTickets / itemsPerPage);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get("q") as string;
    const params = new URLSearchParams(searchParams);
    params.set("q", searchQuery);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <>
      {/* --- Consistent Header Layout --- */}
      <h1 className="text-2xl font-bold mx-6 pt-6">Tickets Queue</h1>
      <div className="flex items-center justify-between mx-6 pt-6">
        <div>
          <h2 className="text-md text-gray-500 mt-1">
            <span className="text-purple-700">{unassignedCount} tickets</span>{" "}
            waiting for assignment
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <SortDropdown />
          {/* --- Consistent Search Bar Styling --- */}
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 w-full"
          >
            <Input
              name="q"
              placeholder="Search by title..."
              defaultValue={currentQuery}
              className="flex-grow border border-blue-600"
            />
            <Button
              type="submit"
              className="bg-blue-800 hover:bg-blue-700 cursor-pointer"
            >
              Search
            </Button>
          </form>
          <Button onClick={handleRefresh} variant="outline" className="h-10">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* --- Consistent Main Content Area --- */}
      <div className="mx-6 pt-4 pb-10 space-y-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalEntries={totalTickets}
          entriesPerPage={itemsPerPage}
          onNext={() => {}}
          onPrev={() => {}}
          className="bg-white py-3.5 px-5"
          onEntriesChange={() => {}}
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
              // --- Consistent Table Row Styling (Zebra Stripes) ---
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
      <TicketQueueModal
        ticket={selectedTicket}
        itStaffList={itStaffList}
        onClose={() => setSelectedTicket(null)}
      />
    </>
  );
}
