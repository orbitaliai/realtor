import { NextRequest, NextResponse } from "next/server";
import { searchProperties } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const parseNum = (key: string) => {
    const v = searchParams.get(key);
    if (v === null) return undefined;
    const n = Number(v);
    return isNaN(n) ? undefined : n;
  };

  const result = searchProperties({
    q: searchParams.get("q") ?? undefined,
    type: searchParams.get("type") ?? undefined,
    neighborhood: searchParams.get("neighborhood") ?? undefined,
    bedrooms: parseNum("bedrooms"),
    bathrooms: parseNum("bathrooms"),
    minPrice: parseNum("minPrice"),
    maxPrice: parseNum("maxPrice"),
    minSqm: parseNum("minSqm"),
    maxSqm: parseNum("maxSqm"),
    page: parseNum("page"),
    limit: parseNum("limit"),
  });

  return NextResponse.json(result);
}
