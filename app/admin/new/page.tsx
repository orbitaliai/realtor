import { AdminNavbar } from "../../../components/admin-navbar";
import { PropertyForm } from "../../../components/property-form";
import { createPropertyAction } from "../../../lib/actions";

export default function NewPropertyPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <section className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Add property
        </h1>
        <PropertyForm action={createPropertyAction} />
      </section>
    </main>
  );
}
