"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  entriesPerPage: number;
  onNext: () => void;
  onPrev: () => void;
  onEntriesChange: (entries: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  entriesPerPage,
  onNext,
  onPrev,
  onEntriesChange,
  className = "",
}: PaginationProps) {
  if (totalPages < 1) {
    return null;
  }
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const baseButtonClasses =
    "flex items-center justify-center text-base text-white disabled:text-gray-500 font-medium bg-purple-800 rounded-full p-1 cursor-pointer disabled:cursor-not-allowed";
  const hoverClasses = "hover:bg-purple-700 hover:text-gray-50";
  const disabledClasses = " bg-white";

  return (
    <div
      className={`flex flex-col sm:flex-row justify-between items-center w-full space-y-4 sm:space-y-0 ${className}`}
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="entries-select" className="text-sm text-gray-700">
            Show
          </label>
          <select
            id="entries-select"
            value={entriesPerPage}
            onChange={(e) => onEntriesChange(Number(e.target.value))}
            className="rounded-xs border border-gray-300 text-gray-800 cursor-pointer ring-0 outline-0 text-xs py-0.5"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-700">entries</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onPrev}
          disabled={!hasPrevPage}
          className={`${baseButtonClasses} ${
            hasPrevPage ? hoverClasses : disabledClasses
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="text-sm font-medium px-1.5">
          {currentPage} of {totalPages}
        </span>
        <button
          onClick={onNext}
          disabled={!hasNextPage}
          className={`${baseButtonClasses} text-white ${
            hasNextPage ? hoverClasses : disabledClasses
          }`}
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
