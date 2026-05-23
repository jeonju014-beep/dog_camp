import { NextRequest, NextResponse } from "next/server";
import { fetchWeatherForecast } from "@/lib/api/openweather";
import { REGIONS } from "@/lib/constants";
import { getMockDashboard } from "@/lib/mock/data";

export async function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get("region") ?? "jeonbuk";
  const meta = REGIONS.find((r) => r.id === region) ?? REGIONS[0];

  try {
    const data = await fetchWeatherForecast(
      meta.lat,
      meta.lon,
      meta.id,
      meta.name
    );
    return NextResponse.json({
      success: true,
      data,
      source: "live",
    });
  } catch (error) {
    const mock = getMockDashboard("all");
    const fallback =
      mock.weather.find((w) => w.region === meta.id) ?? mock.weather[0];
    return NextResponse.json({
      success: true,
      data: fallback,
      source: "mock",
      error: (error as Error).message,
    });
  }
}
