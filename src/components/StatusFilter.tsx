"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TICKET_STATUSES = ["All", "Open", "In Progress", "Resolved", "Closed"];

export default function StatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentStatus = searchParams.get("status") || "All";

  const handleStatusChange = (status: string) => {
    // THE FIX: Initialize new params with the existing searchParams.
    // This copies all current parameters (like 'sort' or 'q')
    // into the new 'params' object, preserving them.
    const params = new URLSearchParams(searchParams);

    if (status === "All") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.set("page", "1"); // Reset to first page when filter changes

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full md:w-[200px]">
      <Select onValueChange={handleStatusChange} value={currentStatus}>
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Filter by status..." />
        </SelectTrigger>
        <SelectContent>
          {TICKET_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
