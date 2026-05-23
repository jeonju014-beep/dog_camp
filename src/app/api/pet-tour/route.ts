import { NextRequest, NextResponse } from "next/server";
import { fetchPetTourList } from "@/lib/api/public-data";
import { getMockDashboard } from "@/lib/mock/data";

export async function GET(request: NextRequest) {
  const areaCode = (request.nextUrl.searchParams.get("areaCode") ??
    "37") as "37" | "38";

  try {
    const data = await fetchPetTourList(areaCode);
    return NextResponse.json({
      success: true,
      data,
      source: "live",
    });
  } catch (error) {
    const mock = getMockDashboard(areaCode);
    return NextResponse.json({
      success: true,
      data: mock.petTours,
      source: "mock",
      error: (error as Error).message,
    });
  }
}
