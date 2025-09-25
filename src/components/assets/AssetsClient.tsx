"use client";

import type { Asset } from "@/app/dashboard/assets/page";
import EmptyState from "@/components/ui/EmptyState";
import AssetCard from "./AssetCard";

// FIX 1: Update the component's props to accept `userRole`.
type AssetsClientProps = {
  initialAssets: Asset[];
  userRole: string | null;
};

export default function AssetsClient({
  initialAssets,
  userRole,
}: AssetsClientProps) {
  return (
    <main className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">My Assigned Assets</h2>
      </div>

      <div className="mt-6">
        {initialAssets.length === 0 ? (
          <EmptyState title="No Assets Assigned" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialAssets.map((asset) => (
              // FIX 2: Pass the `userRole` prop down to each AssetCard.
              <AssetCard key={asset.id} asset={asset} userRole={userRole} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
