import { ReactNode } from "react";

export default function DashboardHeader({ children }: { children: ReactNode }) {
  return (
    <header className="w-full px-8 py-3 h-20 bg-white border-b border-b-gray-300 flex items-center">
      {children}
    </header>
  );
}
