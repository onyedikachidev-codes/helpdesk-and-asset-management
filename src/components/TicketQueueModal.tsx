"use client";

import { useActionState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  QueueTicket,
  ITStaffMember,
} from "@/app/dashboard/ticket-queue/page";
import {
  assignTicketToSelf,
  assignTicketToUser,
  updateTicketStatusFromQueue,
} from "@/app/dashboard/ticket-queue/actions";

type TicketQueueModalProps = {
  ticket: QueueTicket | null;
  itStaffList: ITStaffMember[];
  onClose: () => void;
};

type ActionState = {
  error?: string;
  success?: string;
};

const initialState: ActionState = {};

export default function TicketQueueModal({
  ticket,
  itStaffList,
  onClose,
}: TicketQueueModalProps) {
  const [assignSelfState, assignSelfAction] = useActionState(
    assignTicketToSelf,
    initialState
  );
  const [assignUserState, assignUserAction] = useActionState(
    assignTicketToUser,
    initialState
  );
  const [updateStatusState, updateStatusAction] = useActionState(
    updateTicketStatusFromQueue,
    initialState
  );

  if (!ticket) return null;

  return (
    <Dialog open={!!ticket} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Ticket: TIX-00{ticket.id}</DialogTitle>
          <DialogDescription>{ticket.title}</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="assign" className="w-full mt-4">
          <TabsList>
            <TabsTrigger value="assign">Assign Ticket</TabsTrigger>
            <TabsTrigger value="status">Change Status</TabsTrigger>
          </TabsList>

          <TabsContent value="assign">
            <div className="space-y-4 pt-4">
              <form action={assignSelfAction}>
                <input type="hidden" name="ticketId" value={ticket.id} />
                <Button className="w-full">Assign to Me</Button>
                {assignSelfState.success && (
                  <p className="text-green-500 text-sm mt-2">
                    {assignSelfState.success}
                  </p>
                )}
              </form>
              <form action={assignUserAction} className="space-y-2">
                <input type="hidden" name="ticketId" value={ticket.id} />
                <Select name="assigneeId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Assign to another staff member..." />
                  </SelectTrigger>
                  <SelectContent>
                    {itStaffList.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="w-full" variant="secondary">
                  Assign to Other
                </Button>
                {assignUserState.success && (
                  <p className="text-green-500 text-sm mt-2">
                    {assignUserState.success}
                  </p>
                )}
                {assignUserState.error && (
                  <p className="text-red-500 text-sm mt-2">
                    {assignUserState.error}
                  </p>
                )}
              </form>
            </div>
          </TabsContent>

          <TabsContent value="status">
            <form action={updateStatusAction} className="space-y-2 pt-4">
              <input type="hidden" name="ticketId" value={ticket.id} />
              <Select name="status" defaultValue={ticket.status} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">
                    Closed (Spam/Duplicate)
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full">Update Status</Button>
              {updateStatusState.success && (
                <p className="text-green-500 text-sm mt-2">
                  {updateStatusState.success}
                </p>
              )}
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
