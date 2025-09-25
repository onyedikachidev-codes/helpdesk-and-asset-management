export const getStatusStyles = (status: string) => {
  switch (status?.toLowerCase()) {
    case "low":
      return "bg-green-200 text-green-600";
    case "resolved":
      return "bg-green-200 text-green-600";
    case "booked":
      return "bg-indigo-200 text-indigo-600";
    case "medium":
      return "bg-yellow-200 text-yellow-600";
    case "high":
      return "bg-red-200 text-red-600";
    case "open":
      return "bg-yellow-200 text-yellow-600";
    case "in progress":
      return "bg-purple-200 text-purple-600";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
