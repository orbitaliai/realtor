import { Button, Label, Select, Textarea, TextInput } from "flowbite-react";
import Link from "next/link";
import { NEIGHBORHOODS, PROPERTY_TYPES, type Property } from "../lib/db";

export function PropertyForm({
  action,
  property,
}: {
  action: (formData: FormData) => Promise<void>;
  property?: Property;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="title" className="mb-2 block">
          Title
        </Label>
        <TextInput
          id="title"
          name="title"
          defaultValue={property?.title}
          required
        />
      </div>
      <div>
        <Label htmlFor="description" className="mb-2 block">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={property?.description}
          required
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="neighborhood" className="mb-2 block">
            Neighborhood
          </Label>
          <Select
            id="neighborhood"
            name="neighborhood"
            defaultValue={property?.neighborhood ?? NEIGHBORHOODS[0]}
          >
            {NEIGHBORHOODS.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="type" className="mb-2 block">
            Type
          </Label>
          <Select
            id="type"
            name="type"
            defaultValue={property?.type ?? PROPERTY_TYPES[0]}
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="address" className="mb-2 block">
          Address
        </Label>
        <TextInput
          id="address"
          name="address"
          defaultValue={property?.address}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <Label htmlFor="price" className="mb-2 block">
            Price (€)
          </Label>
          <TextInput
            id="price"
            name="price"
            type="number"
            min={0}
            defaultValue={property?.price}
            required
          />
        </div>
        <div>
          <Label htmlFor="bedrooms" className="mb-2 block">
            Bedrooms
          </Label>
          <TextInput
            id="bedrooms"
            name="bedrooms"
            type="number"
            min={0}
            defaultValue={property?.bedrooms}
            required
          />
        </div>
        <div>
          <Label htmlFor="bathrooms" className="mb-2 block">
            Bathrooms
          </Label>
          <TextInput
            id="bathrooms"
            name="bathrooms"
            type="number"
            min={0}
            defaultValue={property?.bathrooms}
            required
          />
        </div>
        <div>
          <Label htmlFor="sqm" className="mb-2 block">
            Size (m²)
          </Label>
          <TextInput
            id="sqm"
            name="sqm"
            type="number"
            min={0}
            defaultValue={property?.sqm}
            required
          />
        </div>
      </div>
      <div className="mt-2 flex gap-2">
        <Button type="submit">
          {property ? "Save changes" : "Create property"}
        </Button>
        <Button as={Link} href="/admin" color="light">
          Cancel
        </Button>
      </div>
    </form>
  );
}
