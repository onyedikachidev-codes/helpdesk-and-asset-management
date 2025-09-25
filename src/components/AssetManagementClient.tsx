"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { PlusCircle, Filter, CheckCircle, XCircle } from "lucide-react";
import Pagination from "@/components/Pagination";
import ReusuableTable from "@/components/ReusableTable";
import { baseClassName } from "@/constants/index";
import type { Asset, User } from "@/app/dashboard/assets-management/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AssetDetailsModal, CreateAssetModal } from "./CreateAssetModal";

type AssetManagementClientProps = {
  initialAssets: Asset[];
  totalAssets: number;
  users: User[];
  currentPage: number;
  itemsPerPage: number;
};

const tableHeaders = [
  { title: "Asset Tag" },
  { title: "Type" },
  { title: "Manufacturer" },
  { title: "Model" },
  { title: "Assigned To" },
  { title: "Status" },
];

const assetTypes = ["All", "Laptop", "Phone", "Monitor", "Other"];
const assignedStatuses = [
  { label: "All", value: "all" },
  { label: "Assigned", value: "yes" },
  { label: "Unassigned", value: "no" },
];

export default function AssetManagementClient({
  initialAssets,
  totalAssets,
  users,
  currentPage,
  itemsPerPage,
}: AssetManagementClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") || "";
  const currentType = searchParams.get("type") || "All";
  const currentAssigned = searchParams.get("assigned") || "all";

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const totalPages = Math.ceil(totalAssets / itemsPerPage);

  const updateSearchParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "All" && value !== "all") {
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
        <h1 className="text-2xl font-bold">Asset Management</h1>
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="bg-purple-800 hover:bg-purple-700"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Asset
        </Button>
      </div>

      <div className="flex items-center justify-between mx-6 pt-4">
        <div className="flex items-center gap-4">
          <Select
            onValueChange={(val) => updateSearchParam("type", val)}
            value={currentType}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              <SelectValue placeholder="Filter by type..." />
            </SelectTrigger>
            <SelectContent>
              {assetTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(val) => updateSearchParam("assigned", val)}
            value={currentAssigned}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              <SelectValue placeholder="Filter by status..." />
            </SelectTrigger>
            <SelectContent>
              {assignedStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              name="q"
              placeholder="Search assets..."
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
          totalEntries={totalAssets}
          entriesPerPage={itemsPerPage}
          onNext={() => updateSearchParam("page", String(currentPage + 1))}
          onPrev={() => updateSearchParam("page", String(currentPage - 1))}
          className="bg-white py-3.5 px-5"
          onEntriesChange={(limit) => updateSearchParam("limit", String(limit))}
        />
        <ReusuableTable
          headers={tableHeaders}
          data={initialAssets}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          totalItems={totalAssets}
          renderRow={(asset) => (
            <TableRow
              key={asset.id}
              className="odd:bg-[#f8f8fc] cursor-pointer hover:bg-gray-100"
              onClick={() => setSelectedAsset(asset)}
            >
              <TableCell className={baseClassName}>{asset.asset_tag}</TableCell>
              <TableCell className={baseClassName}>
                {asset.asset_type}
              </TableCell>
              <TableCell className={baseClassName}>
                {asset.manufacturer ?? "N/A"}
              </TableCell>
              <TableCell className={baseClassName}>
                {asset.model ?? "N/A"}
              </TableCell>
              <TableCell className={baseClassName}>
                {asset.current_user?.full_name ?? (
                  <span className="text-gray-500">Unassigned</span>
                )}
              </TableCell>
              <TableCell className={baseClassName}>
                {asset.current_user ? (
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" /> Assigned
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <XCircle className="h-4 w-4 mr-1" /> Unassigned
                  </span>
                )}
              </TableCell>
            </TableRow>
          )}
        />
      </div>

      <AssetDetailsModal
        asset={selectedAsset}
        users={users}
        onClose={() => setSelectedAsset(null)}
      />

      <CreateAssetModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </>
  );
}
