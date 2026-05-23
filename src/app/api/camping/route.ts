import { NextRequest, NextResponse } from "next/server";
import { fetchCampingList } from "@/lib/api/public-data";
import { getMockDashboard } from "@/lib/mock/data";
import type { RegionId } from "@/types";

function areaToRegion(area: string | null): RegionId | undefined {
  if (area === "37") return "jeonbuk";
  if (area === "38") return "jeonnam";
  return undefined;
}

export async function GET(request: NextRequest) {
  const areaCode = request.nextUrl.searchParams.get("areaCode");
  const region = areaToRegion(areaCode);

  try {
    const data = await fetchCampingList(region);
    return NextResponse.json({
      success: true,
      data,
      source: "live",
    });
  } catch (error) {
    const mock = getMockDashboard(
      areaCode === "37" ? "37" : areaCode === "38" ? "38" : "all"
    );
    return NextResponse.json({
      success: true,
      data: mock.camping,
      source: "mock",
      error: (error as Error).message,
    });
  }
}
