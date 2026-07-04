"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  SESSION_COOKIE,
  SESSION_TOKEN,
} from "./auth";
import {
  createLead,
  createProperty,
  deleteProperty,
  updateProperty,
  type PropertyInput,
} from "./db";

export async function login(_prevState: string | null, formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return "Invalid username or password";
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, SESSION_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  redirect("/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

function propertyFromForm(formData: FormData): PropertyInput {
  return {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    neighborhood: String(formData.get("neighborhood") ?? ""),
    address: String(formData.get("address") ?? ""),
    price: Number(formData.get("price") ?? 0),
    bedrooms: Number(formData.get("bedrooms") ?? 0),
    bathrooms: Number(formData.get("bathrooms") ?? 0),
    sqm: Number(formData.get("sqm") ?? 0),
    type: String(formData.get("type") ?? ""),
  };
}

export async function createPropertyAction(formData: FormData) {
  createProperty(propertyFromForm(formData));
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updatePropertyAction(id: number, formData: FormData) {
  updateProperty(id, propertyFromForm(formData));
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deletePropertyAction(formData: FormData) {
  deleteProperty(Number(formData.get("id")));
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function submitInterestAction(
  _prev: { error?: string; success?: boolean },
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const propertyId = Number(formData.get("propertyId"));
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!name || !email) return { error: "Name and email are required." };

  createLead(propertyId, name, email, phone);
  revalidatePath("/admin/crm");
  return { success: true };
}
