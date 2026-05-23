import { OPENWEATHER_FORECAST } from "@/lib/constants";
import { parseForecast, type OpenWeatherItem } from "@/lib/utils/weather";
import type { RegionId, WeatherSummary } from "@/types";
import { fetchJson } from "@/lib/utils/fetch-json";

export async function fetchWeatherForecast(
  lat: number,
  lon: number,
  region: RegionId,
  city: string
): Promise<WeatherSummary> {
  const appid = process.env.OPENWEATHER_API_KEY;
  if (!appid) throw new Error("OPENWEATHER_API_KEY is not set");

  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    appid,
    units: "metric",
    lang: "kr",
  });

  const url = `${OPENWEATHER_FORECAST}?${params}`;
  const json = await fetchJson<{ list?: OpenWeatherItem[] }>(url, {
    cache: "no-store",
  });
  const list = json?.list ?? [];
  return parseForecast(list, region, city);
}
