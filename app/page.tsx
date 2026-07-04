import { Badge } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { SiteNavbar } from "../components/site-navbar";
import { formatPrice, getAllProperties, propertyImage } from "../lib/db";

export const dynamic = "force-dynamic";

export default function Home() {
  const properties = getAllProperties();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SiteNavbar />
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Find your home in Barcelona
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {properties.length} properties for sale across the city
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={propertyImage(property.id, property.type)}
                  alt={property.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition group-hover:scale-105"
                />
                <Badge color="dark" className="absolute top-2 left-2">
                  {property.type}
                </Badge>
              </div>
              <div className="p-4">
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(property.price)}
                </p>
                <p className="mt-1 line-clamp-1 font-medium text-gray-700 dark:text-gray-300">
                  {property.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {property.neighborhood} · Barcelona
                </p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {property.bedrooms} bed · {property.bathrooms} bath ·{" "}
                  {property.sqm} m²
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
