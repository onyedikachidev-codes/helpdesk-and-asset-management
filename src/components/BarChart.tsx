"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  ChartOptions,
} from "chart.js";

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type ChartData = {
  role: string;
  count: number;
}[];

export default function UserRolesBarChart({ data }: { data: ChartData }) {
  const chartData = {
    labels: data.map((d) => d.role.charAt(0).toUpperCase() + d.role.slice(1)), // Capitalize role
    datasets: [
      {
        label: "User Count",
        data: data.map((d) => d.count),
        backgroundColor: ["#a78bfa", "#6d28d9"], // Lighter and darker purple
        borderColor: ["#8b5cf6", "#5b21b6"],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y", // Make it a horizontal bar chart
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h2 className="text-xl font-semibold mb-4">User Roles Overview</h2>
      <div className="relative h-64">
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
}
