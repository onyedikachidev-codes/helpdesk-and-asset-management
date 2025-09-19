import { Info } from "lucide-react";
import React from "react";

export default function EmptyState({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center h-48 w-full">
      <div className="flex items-center justify-center">
        <Info className="h-9 w-9 text-purple-800 italic" strokeWidth={1} />
      </div>
      {title && (
        <h3 className="mt-4 text-lg font-sbase text-gray-500">{title}</h3>
      )}
    </div>
  );
}
