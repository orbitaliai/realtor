"use client";

import { Button, Label, TextInput } from "flowbite-react";
import { useActionState } from "react";
import { submitInterestAction } from "../lib/actions";

type FormState = { error?: string; success?: boolean };
const initialState: FormState = {};

export function InterestForm({ propertyId }: { propertyId: number }) {
  const [state, action, pending] = useActionState(submitInterestAction, initialState);

  if (state.success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-700 dark:bg-green-900/20 dark:text-green-400">
        Thanks! An agent will be in touch shortly.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Interested in this property?
      </h2>
      <form action={action} className="flex flex-col gap-4">
        <input type="hidden" name="propertyId" value={propertyId} />
        <div>
          <Label htmlFor="name" className="mb-1">Full name *</Label>
          <TextInput id="name" name="name" placeholder="Maria García" required />
        </div>
        <div>
          <Label htmlFor="email" className="mb-1">Email *</Label>
          <TextInput id="email" name="email" type="email" placeholder="maria@example.com" required />
        </div>
        <div>
          <Label htmlFor="phone" className="mb-1">Phone</Label>
          <TextInput id="phone" name="phone" type="tel" placeholder="+34 600 000 000" />
        </div>
        {state.error && (
          <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
        )}
        <Button type="submit" disabled={pending}>
          {pending ? "Sending…" : "Contact agent"}
        </Button>
      </form>
    </div>
  );
}
