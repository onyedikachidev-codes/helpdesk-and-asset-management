"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Ticket } from "@/app/dashboard/tickets/page";
import StatusSpan from "./ui/StatusSpan";

type TicketDetailsModalProps = {
  ticket: Ticket | null;
  onClose: () => void;
};

export default function TicketDetailsModal({
  ticket,
  onClose,
}: TicketDetailsModalProps) {
  const isOpen = !!ticket;

  if (!ticket) {
    return null;
  }

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
      </DialogContent>
    </Dialog>
  );
}
