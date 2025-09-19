"use client";

import type { Asset } from "@/app/dashboard/assets/page";
import EmptyState from "@/components/ui/EmptyState";
import AssetCard from "./AssetCard";

type AssetsClientProps = {
  initialAssets: Asset[];
};

export default function AssetsClient({ initialAssets }: AssetsClientProps) {
  return (
    <main className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">My Assigned Assets</h2>
      </div>

      <div className="mt-6">
        {initialAssets.length === 0 ? (
          // Use your EmptyState component when there are no assets
          <EmptyState title="No Assets Assigned" />
        ) : (
          // Render a grid of asset cards if there is data
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
