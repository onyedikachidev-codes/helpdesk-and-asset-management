"use client";

import { useActionState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  assignTicketToOther,
  updateTicketStatus,
} from "@/app/dashboard/tickets/admin/actions";
import type {
  AdminTicket,
  ITStaffMember,
} from "@/app/dashboard/tickets/admin/page";
import StatusSpan from "@/components/ui/StatusSpan";

const initialState = { error: "", success: "" };

export default function AdminTicketModal({
  ticket,
  itStaffList,
  onClose,
}: {
  ticket: AdminTicket | null;
  itStaffList: ITStaffMember[];
  onClose: () => void;
}) {
  const [assignState, assignAction] = useActionState(
    assignTicketToOther,
    initialState
  );
  const [statusState, statusAction] = useActionState(
    updateTicketStatus,
    initialState
  );

  useEffect(() => {
    if (assignState.success || statusState.success) {
      const timer = setTimeout(onClose, 1500);
      return () => clearTimeout(timer);
    }
  }, [assignState.success, statusState.success, onClose]);

  if (!ticket) return null;

  return (
    <Dialog open={!!ticket} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ticket Details: TIX-00{ticket.id}</DialogTitle>
          <DialogDescription>{ticket.title}</DialogDescription>
        </DialogHeader>

        {/* Main content area for details */}
        <div className="space-y-2 py-4">
          <div className="flex justify-between items-center">
            <strong className="text-sm text-gray-500">Status:</strong>
            <StatusSpan status={ticket.status}>{ticket.status}</StatusSpan>
          </div>
          <div className="flex justify-between items-center">
            <strong className="text-sm text-gray-500">Submitted by:</strong>
            <span>{ticket.creator?.full_name ?? "N/A"}</span>
          </div>
          <div className="flex justify-between items-center">
            <strong className="text-sm text-gray-500">Assigned to:</strong>
            <span>{ticket.assignee?.full_name ?? "Unassigned"}</span>
          </div>
        </div>

        {/* FIX: Moved actions out of the footer and into their own styled section */}
        <div className="space-y-6 pt-4 border-t">
          {/* Assign Ticket Form */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Assign Ticket
            </label>
            <form action={assignAction} className="flex gap-2 w-full mt-2">
              <input type="hidden" name="ticketId" value={ticket.id} />
              <Select name="assigneeId" required>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select IT Staff..." />
                </SelectTrigger>
                <SelectContent>
                  {itStaffList.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit">Assign</Button>
            </form>
            {assignState.error && (
              <p className="text-red-500 text-xs mt-1">{assignState.error}</p>
            )}
            {assignState.success && (
              <p className="text-green-500 text-xs mt-1">
                {assignState.success}
              </p>
            )}
          </div>

          {/* Change Status Form */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Change Status
            </label>
            <form action={statusAction} className="flex gap-2 w-full mt-2">
              <input type="hidden" name="ticketId" value={ticket.id} />
              <Select name="newStatus" required>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" variant="secondary">
                Update
              </Button>
            </form>
            {statusState.error && (
              <p className="text-red-500 text-xs mt-1">{statusState.error}</p>
            )}
            {statusState.success && (
              <p className="text-green-500 text-xs mt-1">
                {statusState.success}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
