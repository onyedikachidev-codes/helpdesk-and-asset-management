import { Phone, Mail, MapPin, AlertTriangle, LifeBuoy } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-8">Contact IT Support</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Critical Issue Card */}
          <div className="bg-white rounded-lg shadow-md border border-red-200">
            <div className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-500 mr-4" />
                <div>
                  <h2 className="text-xl font-semibold">
                    Report a Critical Issue
                  </h2>
                  <p className="text-gray-600 mt-1">
                    For widespread outages affecting multiple users (e.g.,
                    network down, server offline).
                  </p>
                </div>
              </div>
              <div className="mt-4 text-right">
                <Link
                  href="/dashboard/tickets"
                  className="inline-block bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition-colors"
                >
                  Report Urgent Issue
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="bg-white rounded-lg shadow-md border">
            <div className="p-6">
              <div className="flex items-center">
                <LifeBuoy className="h-8 w-8 text-purple-800 mr-4" />
                <div>
                  <h2 className="text-xl font-semibold">Other Resources</h2>
                  <p className="text-gray-600 mt-1">
                    For all other issues, please use the standard channels.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/dashboard/tickets"
                  className="block bg-purple-800 text-white text-center font-bold py-3 px-4 rounded hover:bg-purple-900 transition-colors"
                >
                  Create a New Ticket
                </Link>
                <Link
                  href="/dashboard/knowledge-base"
                  className="block bg-gray-200 text-gray-800 text-center font-bold py-3 px-4 rounded hover:bg-gray-300 transition-colors"
                >
                  Browse Knowledge Base
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Sidebar */}
        <div className="bg-white rounded-lg shadow-md border p-6">
          <h2 className="text-xl font-semibold mb-4">Direct Contact</h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-center">
              <Phone className="h-5 w-5 mr-3 text-purple-800" />
              <span>+234 (01) 555-IT00</span>
            </li>
            <li className="flex items-center">
              <Mail className="h-5 w-5 mr-3 text-purple-800" />
              <span>support@company.com</span>
            </li>
            <li className="flex items-start">
              <MapPin className="h-5 w-5 mr-3 mt-1 text-purple-800 flex-shrink-0" />
              <span>
                IT Department, 3rd Floor
                <br />
                123 Corporate Drive, Lekki, Lagos
              </span>
            </li>
          </ul>
          <div className="mt-6 pt-4 border-t">
            <h3 className="font-semibold text-gray-800">Hours of Operation</h3>
            <p className="text-sm text-gray-600 mt-1">
              Monday - Friday
              <br />
              9:00 AM - 5:00 PM WAT
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
