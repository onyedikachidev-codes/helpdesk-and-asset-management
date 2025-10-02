"use client";

import { useState, useActionState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  assignTicketToSelf,
  assignTicketToUser,
  updateTicketDetails,
  deleteTicket,
} from "@/app/dashboard/ticket-queue/actions";
import type {
  QueueTicket,
  ITStaffMember,
  TicketCategory,
  TicketPriority,
} from "@/app/dashboard/ticket-queue/page";
import StatusSpan from "@/components/ui/StatusSpan";

const initialState = { error: "", success: "" };

export default function TicketQueueModal({
  ticket,
  itStaffList,
  categories,
  priorities,
  userRole,
  onClose,
}: {
  ticket: QueueTicket | null;
  itStaffList: ITStaffMember[];
  categories: TicketCategory[];
  priorities: TicketPriority[];
  userRole: string;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState("actions");

  // States for all possible actions
  const [deleteState, deleteAction] = useActionState(
    deleteTicket,
    initialState
  );
  const [assignUserState, assignUserAction] = useActionState(
    assignTicketToUser,
    initialState
  );
  const [editState, editAction] = useActionState(
    updateTicketDetails,
    initialState
  );
  const [assignSelfState, assignSelfAction] = useActionState(
    assignTicketToSelf,
    initialState
  );

  const isAdmin = userRole === "admin";

  // Effect to close modal on any successful action
  useEffect(() => {
    if (
      deleteState.success ||
      assignUserState.success ||
      editState.success ||
      assignSelfState.success
    ) {
      const timer = setTimeout(onClose, 1500);
      return () => clearTimeout(timer);
    }
  }, [
    deleteState.success,
    assignUserState.success,
    editState.success,
    assignSelfState.success,
    onClose,
  ]);

  // Effect to reset tab when a new ticket is selected
  useEffect(() => {
    if (ticket) setActiveTab("actions");
  }, [ticket]);

  if (!ticket) return null;

  return (
    <Dialog open={!!ticket} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Ticket: TIX-00{ticket.id}</DialogTitle>
          <DialogDescription>
            &apos;{ticket.title}&apos; by {ticket.creator?.full_name ?? "N/A"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("actions")}
            className={`px-4 py-2 ${
              activeTab === "actions"
                ? "border-b-2 border-purple-600 font-semibold text-purple-600"
                : "text-gray-500"
            }`}
          >
            Actions
          </button>
          {/* The "Edit Ticket" tab is only visible to admins */}
          {isAdmin && (
            <button
              onClick={() => setActiveTab("edit")}
              className={`px-4 py-2 ${
                activeTab === "edit"
                  ? "border-b-2 border-purple-600 font-semibold text-purple-600"
                  : "text-gray-500"
              }`}
            >
              Edit Ticket
            </button>
          )}
        </div>

        {activeTab === "actions" && (
          <div className="py-4 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <strong className="text-sm text-gray-500">Status:</strong>
                <StatusSpan status={ticket.status}>{ticket.status}</StatusSpan>
              </div>
              <div className="flex justify-between items-center">
                <strong className="text-sm text-gray-500">Assigned to:</strong>
                <span>{ticket.assignee?.full_name ?? "Unassigned"}</span>
              </div>
              <div className="flex justify-between items-center">
                <strong className="text-sm text-gray-500">Priority:</strong>
                <span>{ticket.priority}</span>
              </div>
            </div>

            <form action={assignSelfAction}>
              <input type="hidden" name="ticketId" value={ticket.id} />
              <Button type="submit" className="w-full">
                Assign to Me
              </Button>
              {assignSelfState.error && (
                <p className="text-red-500 text-xs mt-1">
                  {assignSelfState.error}
                </p>
              )}
              {assignSelfState.success && (
                <p className="text-green-500 text-xs mt-1">
                  {assignSelfState.success}
                </p>
              )}
            </form>

            <form action={assignUserAction}>
              <input type="hidden" name="ticketId" value={ticket.id} />
              <label className="text-sm font-semibold text-gray-700">
                Assign to Other
              </label>
              <div className="flex gap-2 w-full mt-1">
                <Select name="assigneeId" required>
                  <SelectTrigger>
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
              </div>
              {assignUserState.error && (
                <p className="text-red-500 text-xs mt-1">
                  {assignUserState.error}
                </p>
              )}
              {assignUserState.success && (
                <p className="text-green-500 text-xs mt-1">
                  {assignUserState.success}
                </p>
              )}
            </form>

            {/* The "Delete Ticket" button is only visible to admins */}
            {isAdmin && (
              <form action={deleteAction}>
                <input type="hidden" name="ticketId" value={ticket.id} />
                <Button type="submit" variant="destructive" className="w-full">
                  Delete Ticket
                </Button>
                {deleteState.error && (
                  <p className="text-red-500 text-xs mt-1">
                    {deleteState.error}
                  </p>
                )}
                {deleteState.success && (
                  <p className="text-green-500 text-xs mt-1">
                    {deleteState.success}
                  </p>
                )}
              </form>
            )}
          </div>
        )}

        {/* The entire "Edit" tab is only rendered for admins */}
        {isAdmin && activeTab === "edit" && (
          <form action={editAction} className="py-4 space-y-4">
            <input type="hidden" name="ticketId" value={ticket.id} />
            <div>
              <label className="text-sm font-semibold">Title</label>
              <Input name="title" defaultValue={ticket.title} required />
            </div>
            <div>
              <label className="text-sm font-semibold">Description</label>
              <Textarea
                name="description"
                defaultValue={ticket.description}
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Category</label>
              <Select name="category" defaultValue={ticket.category}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-semibold">Priority</label>
              <Select name="priority" defaultValue={ticket.priority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p.name} value={p.name}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
            {editState.error && (
              <p className="text-red-500 text-xs mt-1">{editState.error}</p>
            )}
            {editState.success && (
              <p className="text-green-500 text-xs mt-1">{editState.success}</p>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
