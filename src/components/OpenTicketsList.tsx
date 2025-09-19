import Link from "next/link";

// Define the type for a single ticket
type Ticket = {
  id: number;
  title: string;
  status: string;
  created_at: string;
};

type OpenTicketsListProps = {
  tickets: Ticket[];
};

const StatusBadge = ({ status }: { status: string }) => {
  const baseClasses = "px-3 py-1 text-xs font-bold rounded-full";
  const statusClasses: { [key: string]: string } = {
    Open: "bg-blue-100 text-blue-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    "Awaiting Reply": "bg-orange-100 text-orange-800",
    Resolved: "bg-green-100 text-green-800",
  };
  return (
    <span
      className={`${baseClasses} ${
        statusClasses[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

export default function OpenTicketsList({ tickets }: OpenTicketsListProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        My Open Tickets
      </h3>
      {tickets.length > 0 ? (
        <ul className="space-y-4">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="border-b pb-4 last:border-b-0">
              <Link
                href={`/tickets/${ticket.id}`}
                className="block hover:bg-gray-50 p-2 rounded-md"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {ticket.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Opened on{" "}
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={ticket.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 py-8">
          You have no open tickets.
        </p>
      )}
    </div>
  );
}
