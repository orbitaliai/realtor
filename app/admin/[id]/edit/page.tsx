import { notFound } from "next/navigation";
import { AdminNavbar } from "../../../../components/admin-navbar";
import { PropertyForm } from "../../../../components/property-form";
import { updatePropertyAction } from "../../../../lib/actions";
import { getProperty } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = getProperty(Number(id));
  if (!property) notFound();

  const updateAction = updatePropertyAction.bind(null, property.id);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <section className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Edit property #{property.id}
        </h1>
        <PropertyForm action={updateAction} property={property} />
      </section>
    </main>
  );
}
