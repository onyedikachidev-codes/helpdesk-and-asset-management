"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const filters = [
  { label: "All Tickets", value: "all" },
  { label: "My Tickets", value: "me" },
  { label: "Unassigned", value: "unassigned" },
];

export default function AssignmentFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("assignment") || "all";

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete("assignment");
    } else {
      params.set("assignment", value);
    }
    params.set("page", "1"); // Reset to first page when filter changes
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select value={currentFilter} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by assignment..." />
      </SelectTrigger>
      <SelectContent>
        {filters.map((filter) => (
          <SelectItem key={filter.value} value={filter.value}>
            {filter.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
