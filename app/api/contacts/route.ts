import { NextRequest, NextResponse } from "next/server";
import { createLead, getProperty } from "@/lib/db";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Body must be a JSON object" }, { status: 400 });
  }

  const { propertyId, name, email, phone } = body as Record<string, unknown>;

  if (!propertyId || typeof propertyId !== "number") {
    return NextResponse.json({ error: "propertyId (number) is required" }, { status: 400 });
  }
  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "name (string) is required" }, { status: 400 });
  }
  if (!email || typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "email (string) is required" }, { status: 400 });
  }

  const property = getProperty(propertyId);
  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  createLead(propertyId, name.trim(), email.trim(), typeof phone === "string" ? phone.trim() : "");

  return NextResponse.json({ success: true }, { status: 201 });
}
