import { Badge } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InterestForm } from "../../../components/interest-form";
import { SiteNavbar } from "../../../components/site-navbar";
import { formatPrice, getProperty, propertyImage } from "../../../lib/db";

export const dynamic = "force-dynamic";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = getProperty(Number(id));
  if (!property) notFound();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SiteNavbar />
      <section className="mx-auto max-w-4xl px-4 py-10">
        <Link
          href="/"
          className="mb-4 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to all properties
        </Link>
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="relative h-80 w-full">
            <Image
              src={propertyImage(property.id, property.type, 1200, 800)}
              alt={property.title}
              fill
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
              priority
            />
          </div>
          <div className="p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {property.title}
                </h1>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {property.address} · {property.neighborhood}, Barcelona
                </p>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatPrice(property.price)}
              </p>
            </div>
            <div className="mb-6 flex flex-wrap gap-2">
              <Badge color="info">{property.type}</Badge>
              <Badge color="gray">{property.bedrooms} bedrooms</Badge>
              <Badge color="gray">{property.bathrooms} bathrooms</Badge>
              <Badge color="gray">{property.sqm} m²</Badge>
              <Badge color="gray">
                {formatPrice(Math.round(property.price / property.sqm))}/m²
              </Badge>
            </div>
            <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-300">
              {property.description}
            </p>
            <InterestForm propertyId={property.id} />
          </div>
        </div>
      </section>
    </main>
  );
}
