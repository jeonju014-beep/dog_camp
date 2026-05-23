import { NextRequest, NextResponse } from "next/server";
import { buildDashboard } from "@/lib/api/dashboard";
import { getMockDashboard } from "@/lib/mock/data";
import type { RegionCode } from "@/types";

export async function GET(request: NextRequest) {
  const region = (request.nextUrl.searchParams.get("region") ??
    "all") as RegionCode;

  try {
    const data = await buildDashboard(region);
    return NextResponse.json(
      { success: true, data },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    const data = getMockDashboard(region);
    return NextResponse.json(
      {
        success: true,
        data,
        error: (error as Error).message,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
