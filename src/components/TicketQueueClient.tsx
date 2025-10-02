"use client";

import { useState, useActionState, useEffect } from "react"; // 1. Import useActionState and useEffect
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCw, Trash2 } from "lucide-react";
import Pagination from "@/components/Pagination";
import ReusuableTable from "@/components/ReusableTable";
import SortDropdown from "@/components/SortDropdown";
import StatusSpan from "@/components/ui/StatusSpan";
import { baseClassName } from "@/constants/index";
import type {
  QueueTicket,
  ITStaffMember,
  TicketCategory,
  TicketPriority,
} from "@/app/dashboard/ticket-queue/page";
import TicketQueueModal from "./TicketQueueModal";
// 2. Import the server action for bulk deletion
import { deleteSelectedTickets } from "@/app/dashboard/ticket-queue/actions";

type TicketQueueClientProps = {
  initialTickets: QueueTicket[];
  totalTickets: number;
  unassignedCount: number;
  itStaffList: ITStaffMember[];
  categories: TicketCategory[];
  priorities: TicketPriority[];
  currentPage: number;
  itemsPerPage: number;
  userRole: string;
};

// 3. Define the initial state for the delete action
const initialState = { error: "", success: "" };

export default function TicketQueueClient({
  initialTickets,
  totalTickets,
  unassignedCount,
  itStaffList,
  categories,
  priorities,
  currentPage,
  itemsPerPage,
  userRole,
}: TicketQueueClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") || "";

  const [selectedTicket, setSelectedTicket] = useState<QueueTicket | null>(
    null
  );
  const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
  // 4. Initialize the action state for the bulk delete form
  const [deleteState, deleteAction] = useActionState(
    deleteSelectedTickets,
    initialState
  );

  const isAdmin = userRole === "admin";

  // 5. Add an effect to clear the selection after a successful delete
  useEffect(() => {
    if (deleteState.success) {
      setSelectedTickets([]);
    }
  }, [deleteState.success]);

  const handleSelectTicket = (ticketId: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedTickets((prev) => [...prev, ticketId]);
    } else {
      setSelectedTickets((prev) => prev.filter((id) => id !== ticketId));
    }
  };

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedTickets(initialTickets.map((ticket) => ticket.id));
    } else {
      setSelectedTickets([]);
    }
  };

  const tableHeaders = [
    ...(isAdmin
      ? [
          {
            title: (
              <Checkbox
                id="select-all"
                onCheckedChange={(isChecked) => handleSelectAll(!!isChecked)}
                checked={
                  initialTickets.length > 0 &&
                  selectedTickets.length === initialTickets.length
                }
              />
            ),
            className: "w-12",
          },
        ]
      : []),
    { title: "Ticket Id" },
    { title: "Title" },
    { title: "Status" },
    { title: "Created By" },
    { title: "Assigned To" },
    { title: "Last Updated" },
  ];

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

      {/* 6. The bulk action bar is now a fully functional form */}
      {isAdmin && selectedTickets.length > 0 && (
        <div className="mx-6 pt-4">
          <form action={deleteAction}>
            <div className="bg-purple-100 border border-purple-200 text-purple-800 px-4 py-2 rounded-lg flex items-center justify-between">
              <span className="font-semibold">
                {selectedTickets.length} ticket(s) selected
              </span>
              <input
                type="hidden"
                name="ticketIds"
                value={JSON.stringify(selectedTickets)}
              />
              <Button type="submit" variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" /> Delete Selected
              </Button>
            </div>
            {/* Display success or error messages from the bulk delete action */}
            {deleteState.error && (
              <p className="text-red-500 text-xs mt-1">{deleteState.error}</p>
            )}
            {deleteState.success && (
              <p className="text-green-500 text-xs mt-1">
                {deleteState.success}
              </p>
            )}
          </form>
        </div>
      )}

      <div className="mx-6 pt-4 pb-10 space-y-2">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalTickets / itemsPerPage)}
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
              className="odd:bg-[#f8f8fc] hover:bg-gray-100"
              onClick={(e) => {
                if ((e.target as HTMLElement).closest(".checkbox-cell")) return;
                setSelectedTicket(ticket);
              }}
            >
              {isAdmin && (
                <TableCell
                  className="checkbox-cell cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    id={`select-${ticket.id}`}
                    onCheckedChange={(isChecked) =>
                      handleSelectTicket(ticket.id, !!isChecked)
                    }
                    checked={selectedTickets.includes(ticket.id)}
                  />
                </TableCell>
              )}
              <TableCell className={`${baseClassName} cursor-pointer`}>
                TIX-00{ticket.id}
              </TableCell>
              <TableCell className={`${baseClassName} cursor-pointer`}>
                {ticket.title}
              </TableCell>
              <TableCell className={`${baseClassName} cursor-pointer`}>
                <StatusSpan status={ticket.status}>{ticket.status}</StatusSpan>
              </TableCell>
              <TableCell className={`${baseClassName} cursor-pointer`}>
                {ticket.creator?.full_name ?? "N/A"}
              </TableCell>
              <TableCell className={`${baseClassName} cursor-pointer`}>
                {ticket.assignee?.full_name ?? (
                  <span className="text-red-500 font-semibold">Unassigned</span>
                )}
              </TableCell>
              <TableCell className={`${baseClassName} cursor-pointer`}>
                {new Date(ticket.updated_at).toLocaleString()}
              </TableCell>
            </TableRow>
          )}
        />
      </div>
      <TicketQueueModal
        ticket={selectedTicket}
        itStaffList={itStaffList}
        categories={categories}
        priorities={priorities}
        userRole={userRole}
        onClose={() => setSelectedTicket(null)}
      />
    </>
  );
}
