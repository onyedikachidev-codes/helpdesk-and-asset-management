import { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: number;
  icon: ReactNode;
};

export default function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col justify-between h-full">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-gray-500">{title}</p>
          <div className="text-purple-800">{icon}</div>
        </div>
        <p className="text-3xl font-bold text-gray-800 text-left mt-auto">
          {value}
        </p>
      </div>
    </div>
  );
}
