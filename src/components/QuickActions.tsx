import Link from "next/link";

export default function QuickActions() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-start justify-center h-full">
      <h3 className="text-lg font-semibold text-gray-600 mb-4">No Tickets?</h3>
      <p className="">
        Go to{" "}
        <Link
          href="/dashboard/tickets"
          className="underline text-blue-700 hover:text-blue-500"
        >
          My tickets
        </Link>{" "}
        to create a new ticket.
      </p>
    </div>
  );
}
