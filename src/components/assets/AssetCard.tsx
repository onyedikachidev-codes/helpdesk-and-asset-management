"use client";

import type { Asset } from "@/app/dashboard/assets/page";
import { Button } from "@/components/ui/button";
import { Laptop, Monitor, Smartphone, Package } from "lucide-react";
import Link from "next/link";

const getAssetIcon = (type: Asset["asset_type"]) => {
  switch (type) {
    case "Laptop":
      return <Laptop className="h-8 w-8 text-purple-800" />;
    case "Monitor":
      return <Monitor className="h-8 w-8 text-purple-800" />;
    case "Phone":
      return <Smartphone className="h-8 w-8 text-purple-800" />;
    default:
      return <Package className="h-8 w-8 text-purple-800" />;
  }
};

// FIX 1: Add `userRole` to the component's props.
export default function AssetCard({
  asset,
  userRole,
}: {
  asset: Asset;
  userRole: string | null;
}) {
  const assetName = `${asset.manufacturer || ""} ${asset.model || ""}`.trim();
  const reportIssueUrl = `/dashboard/tickets/new?asset_tag=${asset.asset_tag}&asset_name=${assetName}`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-start gap-4">
          {getAssetIcon(asset.asset_type)}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">
              {asset.asset_type}
            </p>
            <h3 className="text-lg font-bold text-gray-800">{assetName}</h3>
          </div>
        </div>
        <div className="mt-6 space-y-3 text-sm border-t pt-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Asset Tag:</span>
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              {asset.asset_tag}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Serial Number:</span>
            <span className="font-medium text-gray-800">
              {asset.serial_number ?? "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date Assigned:</span>
            <span className="font-medium text-gray-800">
              {new Date(asset.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      {/* FIX 2: Conditionally render the button based on the user's role. */}
      <div className="mt-6">
        {userRole?.toLowerCase() !== "it_staff" ? (
          <Link href="/dashboard/ticket">
            <Button className="w-full bg-purple-100 text-purple-800 hover:bg-purple-200">
              Report an Issue
            </Button>
          </Link>
        ) : (
          <Button disabled className="w-full">
            Managed by IT
          </Button>
        )}
      </div>
    </div>
  );
}
