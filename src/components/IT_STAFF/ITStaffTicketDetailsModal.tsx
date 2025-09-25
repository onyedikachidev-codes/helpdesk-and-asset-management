"use client";

import { useEffect, useState, useActionState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import StatusSpan from "../ui/StatusSpan";
import { Button } from "../ui/button";
import { updateTicketStatus } from "@/app/dashboard/tickets/it-staff/actions";
import { ITStaffTicket } from "@/app/dashboard/tickets/it-staff/page";

// Define the shape of the state object for the form action
type ActionState = {
  error?: string | null;
  success?: string | null;
};

type TicketDetailsModalProps = {
  ticket: ITStaffTicket | null;
  onClose: () => void;
};

const TICKET_STATUSES = ["Open", "In Progress", "Resolved"];

export default function ITStaffTicketDetailsModal({
  ticket,
  onClose,
}: TicketDetailsModalProps) {
  const isOpen = !!ticket;
  const [currentStatus, setCurrentStatus] = useState(ticket?.status || "Open");

  // Initial state for the form action
  const initialState: ActionState = {
    error: null,
    success: null,
  };

  // useActionState for handling form submission feedback
  const [state, formAction] = useActionState(updateTicketStatus, initialState);

  useEffect(() => {
    if (ticket) {
      setCurrentStatus(ticket.status);
    }
  }, [ticket]);

  useEffect(() => {
    // If the form submission was successful, close the modal
    if (state.success) {
      onClose();
    }
  }, [state.success, onClose]);

  if (!ticket) {
    return null;
  }

  const creatorName = ticket.created_by?.full_name ?? "N/A";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ticket Details: TIX-00{ticket.id}</DialogTitle>
          <DialogDescription>{ticket.title}</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <span className="font-semibold text-gray-500">Status:</span>
            <div className="col-span-2">
              <StatusSpan status={ticket.status}>{ticket.status}</StatusSpan>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="font-semibold text-gray-500">Submitted By:</span>
            <p className="col-span-2 text-gray-800">{creatorName}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="font-semibold text-gray-500">Priority:</span>
            <p className="col-span-2 text-gray-800">{ticket.priority}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="font-semibold text-gray-500">Category:</span>
            <p className="col-span-2 text-gray-800">{ticket.category}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="font-semibold text-gray-500">Description:</span>
            <p className="col-span-2 text-gray-800">{ticket.description}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="font-semibold text-gray-500">Created On:</span>
            <span className="col-span-2 text-gray-800">
              {new Date(ticket.created_at).toLocaleString()}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="font-semibold text-gray-500">Last Updated:</span>
            <span className="col-span-2 text-gray-800">
              {new Date(ticket.updated_at).toLocaleString()}
            </span>
          </div>
        </div>

        <form action={formAction} className="mt-6 space-y-4">
          <input type="hidden" name="ticketId" value={ticket.id} />
          <div>
            <label
              htmlFor="status-select"
              className="block text-sm font-medium text-gray-700"
            >
              Update Status
            </label>
            <select
              id="status-select"
              name="newStatus"
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {TICKET_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter>
            {state.error && (
              <p className="text-red-500 text-sm mr-auto">{state.error}</p>
            )}
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
