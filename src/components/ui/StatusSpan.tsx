import React from "react";
import { getStatusStyles } from "../../constants/functions";

export default function StatusSpan({
  children,
  status,
}: {
  children: React.ReactNode;
  status: string;
}) {
  return (
    <span
      className={`inline-flex px-3 py-1 leading-5 ${getStatusStyles(status)}`}
    >
      {children}
    </span>
  );
}
