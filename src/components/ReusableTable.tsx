import React, { ReactNode } from "react"; // 1. Import ReactNode
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableHeaderProps {
  title: ReactNode;
  className?: string;
}

interface ReusuableTableProps<T extends { id: string | number }> {
  headers: TableHeaderProps[];
  data: T[];
  renderRow: (row: T) => React.ReactNode;
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}

export default function ReusuableTable<T extends { id: string | number }>({
  headers,
  data,
  renderRow,
  totalItems,
  itemsPerPage,
  currentPage,
}: ReusuableTableProps<T>) {
  if (!headers || !Array.isArray(headers) || headers.length === 0) {
    return null;
  }

  const firstItemIndex = (currentPage - 1) * itemsPerPage + 1;
  const lastItemIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <>
      {data.length > 0 ? (
        <>
          <Table className="bg-white p-2">
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead
                    key={index}
                    className={`border-r last:border-r-0 whitespace-nowrap align-top text-xs font-bold px-4 py-4 uppercase text-blue-900 border border-gray-300 tracking-wider`}
                  >
                    {header.title}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>{data.map((row) => renderRow(row))}</TableBody>
          </Table>

          <div className="bg-gray-50 text-center py-4 -translate-y-2">
            Showing &nbsp;
            <b>
              {firstItemIndex} to {lastItemIndex}
            </b>
            &nbsp; tickets
          </div>
        </>
      ) : (
        <div className="flex h-48 items-center justify-center">
          <p className="text-gray-500">No data available.</p>
        </div>
      )}
    </>
  );
}
