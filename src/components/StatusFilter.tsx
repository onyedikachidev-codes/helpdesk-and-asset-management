"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statuses = ["All", "Open", "In Progress", "Awaiting Reply", "Resolved"];

export default function StatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "All";

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status === "All") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.set("page", "1");

    router.push(`/dashboard/tickets?${params.toString()}`);
  };

  return (
    <div className="w-full md:w-[200px]">
      <Select onValueChange={handleStatusChange} value={currentStatus}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by status..." />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
