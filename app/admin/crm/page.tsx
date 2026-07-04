import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import Link from "next/link";
import { AdminNavbar } from "../../../components/admin-navbar";
import { getAllLeads } from "../../../lib/db";

export const dynamic = "force-dynamic";

export default function CrmPage() {
  const leads = getAllLeads();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            CRM — Interested Buyers ({leads.length})
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            People who have expressed interest in a property.
          </p>
        </div>

        {leads.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            No leads yet. They will appear here when visitors submit the interest form on a property page.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
            <Table hoverable>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Date</TableHeadCell>
                  <TableHeadCell>Name</TableHeadCell>
                  <TableHeadCell>Email</TableHeadCell>
                  <TableHeadCell>Phone</TableHeadCell>
                  <TableHeadCell>Property</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {leads.map((lead) => (
                  <TableRow key={lead.id} className="bg-white dark:bg-gray-800">
                    <TableCell className="whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {new Date(lead.createdAt).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900 dark:text-white">
                      {lead.name}
                    </TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {lead.email}
                      </a>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {lead.phone || <span className="text-gray-400">—</span>}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      <Link
                        href={`/properties/${lead.propertyId}`}
                        className="hover:underline text-gray-900 dark:text-white"
                      >
                        {lead.propertyTitle}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </main>
  );
}
