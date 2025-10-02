"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  ChartOptions,
} from "chart.js";

// Register the necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

type ChartData = {
  day: string;
  count: number;
}[];

export default function TicketsLineChart({ data }: { data: ChartData }) {
  const chartData = {
    labels: data.map((d) => d.day),
    datasets: [
      {
        label: "Tickets Created",
        data: data.map((d) => d.count),
        borderColor: "#5b21b6", // purple-800
        backgroundColor: "rgba(91, 33, 182, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h2 className="text-xl font-semibold mb-4">
        Tickets Created (Last 7 Days)
      </h2>
      <div className="relative h-64">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}
