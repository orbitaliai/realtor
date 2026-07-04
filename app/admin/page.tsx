import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import Link from "next/link";
import { AdminNavbar } from "../../components/admin-navbar";
import { deletePropertyAction } from "../../lib/actions";
import { formatPrice, getAllProperties } from "../../lib/db";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const properties = getAllProperties();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Properties ({properties.length})
          </h1>
          <Button as={Link} href="/admin/new">
            + Add property
          </Button>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
          <Table hoverable>
            <TableHead>
              <TableRow>
                <TableHeadCell>ID</TableHeadCell>
                <TableHeadCell>Title</TableHeadCell>
                <TableHeadCell>Neighborhood</TableHeadCell>
                <TableHeadCell>Address</TableHeadCell>
                <TableHeadCell>Type</TableHeadCell>
                <TableHeadCell>Price</TableHeadCell>
                <TableHeadCell>Beds</TableHeadCell>
                <TableHeadCell>Baths</TableHeadCell>
                <TableHeadCell>m²</TableHeadCell>
                <TableHeadCell>
                  <span className="sr-only">Actions</span>
                </TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {properties.map((property) => (
                <TableRow
                  key={property.id}
                  className="bg-white dark:bg-gray-800"
                >
                  <TableCell className="text-gray-500">
                    {property.id}
                  </TableCell>
                  <TableCell className="max-w-xs truncate font-medium text-gray-900 dark:text-white">
                    <Link
                      href={`/properties/${property.id}`}
                      className="hover:underline"
                    >
                      {property.title}
                    </Link>
                  </TableCell>
                  <TableCell>{property.neighborhood}</TableCell>
                  <TableCell className="max-w-48 truncate">
                    {property.address}
                  </TableCell>
                  <TableCell>{property.type}</TableCell>
                  <TableCell className="font-semibold whitespace-nowrap text-gray-900 dark:text-white">
                    {formatPrice(property.price)}
                  </TableCell>
                  <TableCell>{property.bedrooms}</TableCell>
                  <TableCell>{property.bathrooms}</TableCell>
                  <TableCell>{property.sqm}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <Link
                        href={`/admin/${property.id}/edit`}
                        className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Edit
                      </Link>
                      <form action={deletePropertyAction}>
                        <input type="hidden" name="id" value={property.id} />
                        <button
                          type="submit"
                          className="font-medium text-red-600 hover:underline dark:text-red-400"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
}
