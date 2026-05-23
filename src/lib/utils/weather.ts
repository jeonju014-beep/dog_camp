import type { WeatherDay, WeatherSummary } from "@/types";
import type { RegionId } from "@/types";

export interface OpenWeatherItem {
  dt: number;
  main: { temp: number; temp_min: number; temp_max: number };
  weather: { description: string }[];
  pop: number;
  wind: { speed: number };
  clouds?: { all: number };
  rain?: { "3h"?: number };
}

export function parseForecast(
  list: OpenWeatherItem[],
  region: RegionId,
  city: string
): WeatherSummary {
  const byDate = new Map<string, OpenWeatherItem[]>();

  for (const item of list) {
    const date = new Date(item.dt * 1000).toISOString().slice(0, 10);
    const arr = byDate.get(date) ?? [];
    arr.push(item);
    byDate.set(date, arr);
  }

  const days: WeatherDay[] = [...byDate.entries()]
    .slice(0, 5)
    .map(([date, items]) => {
      const temps = items.map((i) => i.main.temp);
      const tempMin = Math.min(...items.map((i) => i.main.temp_min));
      const tempMax = Math.max(...items.map((i) => i.main.temp_max));
      const tempAvg =
        temps.reduce((a, b) => a + b, 0) / Math.max(temps.length, 1);
      const rainMm = items.reduce(
        (a, i) => a + (i.rain?.["3h"] ?? 0),
        0
      );
      const pop = Math.max(...items.map((i) => Math.round(i.pop * 100)));
      const windMax = Math.max(...items.map((i) => i.wind.speed));
      const description = items[0]?.weather[0]?.description ?? "";
      const clouds = Math.round(
        items.reduce((a, i) => a + (i.clouds?.all ?? 0), 0) /
          Math.max(items.length, 1)
      );

      return {
        date,
        label: formatDateLabel(date),
        tempMin: Math.round(tempMin),
        tempMax: Math.round(tempMax),
        tempAvg: Math.round(tempAvg),
        rainMm: Math.round(rainMm * 10) / 10,
        pop,
        windMax: Math.round(windMax * 10) / 10,
        description,
        clouds,
      };
    });

  const avgTemp =
    days.reduce((a, d) => a + d.tempAvg, 0) / Math.max(days.length, 1);
  const rainyDays = days.filter(
    (d) => d.rainMm >= 0.5 || d.pop >= 50
  ).length;
  const goodTempDays = days.filter(
    (d) => d.tempAvg >= 15 && d.tempAvg <= 25
  ).length;

  return {
    region,
    city,
    days,
    avgTemp: Math.round(avgTemp),
    rainyDays,
    goodTempDays,
  };
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso);
  const w = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  return `${d.getMonth() + 1}/${d.getDate()}(${w})`;
}
