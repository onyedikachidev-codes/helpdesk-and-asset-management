"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { PlusCircle, Filter, ShieldCheck, ShieldOff } from "lucide-react";
import Pagination from "@/components/Pagination";
import ReusuableTable from "@/components/ReusableTable";
import { baseClassName } from "@/constants/index";
import type { UserProfile } from "@/app/dashboard/user-management/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateUserModal, UserDetailsModal } from "./userModals";

type UserManagementClientProps = {
  initialUsers: UserProfile[];
  totalUsers: number;
  currentPage: number;
  itemsPerPage: number;
};

const tableHeaders = [
  { title: "Full Name" },
  { title: "Email" },
  { title: "Job Title" },
  { title: "Department" },
  { title: "Role" },
  { title: "Status" },
];

const roleFilters = [
  { label: "All Roles", value: "all" },
  { label: "Employee", value: "employee" },
  { label: "IT Staff", value: "it_staff" },
  { label: "Admin", value: "admin" },
];

export default function UserManagementClient({
  initialUsers,
  totalUsers,
  currentPage,
  itemsPerPage,
}: UserManagementClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") || "";
  const currentRole = searchParams.get("role") || "all";

  // State to manage modals
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  const updateSearchParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    updateSearchParam("q", formData.get("q") as string);
  };

  return (
    <>
      <div className="flex items-center justify-between mx-6 pt-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="bg-purple-800 hover:bg-purple-700"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New User
        </Button>
      </div>

      <div className="flex items-center justify-between mx-6 pt-4">
        <div className="flex items-center gap-4">
          <Select
            onValueChange={(val) => updateSearchParam("role", val)}
            value={currentRole}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              <SelectValue placeholder="Filter by role..." />
            </SelectTrigger>
            <SelectContent>
              {roleFilters.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              name="q"
              placeholder="Search by name or email..."
              defaultValue={currentQuery}
              className="border-purple-600"
            />
            <Button type="submit" className="bg-purple-800 hover:bg-purple-700">
              Search
            </Button>
          </form>
        </div>
      </div>

      <div className="mx-6 pt-4 pb-10 space-y-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalEntries={totalUsers}
          entriesPerPage={itemsPerPage}
          onNext={() => updateSearchParam("page", String(currentPage + 1))}
          onPrev={() => updateSearchParam("page", String(currentPage - 1))}
          className="bg-white py-3.5 px-5"
          onEntriesChange={(limit) => updateSearchParam("limit", String(limit))}
        />
        <ReusuableTable
          headers={tableHeaders}
          data={initialUsers}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          totalItems={totalUsers}
          renderRow={(user) => (
            <TableRow
              key={user.id}
              className="odd:bg-[#f8f8fc] cursor-pointer hover:bg-gray-100"
              onClick={() => setSelectedUser(user)}
            >
              <TableCell className={baseClassName}>
                {user.full_name ?? "N/A"}
              </TableCell>
              <TableCell className={baseClassName}>{user.email}</TableCell>
              <TableCell className={baseClassName}>
                {user.job_title ?? "N/A"}
              </TableCell>
              <TableCell className={baseClassName}>
                {user.department ?? "N/A"}
              </TableCell>
              <TableCell className={baseClassName}>
                <span className="capitalize font-medium">{user.role}</span>
              </TableCell>
              <TableCell className={baseClassName}>
                {user.is_active ? (
                  <span className="flex items-center text-green-600">
                    <ShieldCheck className="h-4 w-4 mr-1" /> Active
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <ShieldOff className="h-4 w-4 mr-1" /> Deactivated
                  </span>
                )}
              </TableCell>
            </TableRow>
          )}
        />
      </div>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <UserDetailsModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </>
  );
}
