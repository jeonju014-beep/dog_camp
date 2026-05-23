import {
  assignMarkerTiers,
  calcCampingSiteScore,
} from "@/lib/utils/camping-score";
import type { CampingItem, TodayWeather, WeatherSummary } from "@/types";

export function enrichCampingList(
  camps: CampingItem[],
  weatherByRegion: Partial<Record<"jeonbuk" | "jeonnam", WeatherSummary>>
): CampingItem[] {
  const scored = camps.map((c) => {
    const weather = weatherByRegion[c.region];
    const score = calcCampingSiteScore(
      {
        animalCmgCl: c.allowedSize,
        sbrsCl: c.petFacilities.join(","),
        themaEnvrnCl: c.environment,
      },
      weather
    );
    const today = weather?.days[0];
    return {
      ...c,
      score,
      weatherDays: weather?.days ?? [],
      todayTemp: today?.tempAvg ?? weather?.avgTemp ?? 0,
      todayPop: today?.pop ?? 0,
    };
  });

  const tiers = assignMarkerTiers(scored);
  const sorted = [...scored].sort((a, b) => b.score - a.score);

  return sorted.map((c, i) => {
    const tier = tiers.get(c.id) ?? (c.score >= 70 ? "high" : "low");
    return {
      ...c,
      rank: i + 1,
      markerTier: tier,
      isBestSpot: tier === "best",
    };
  });
}

export function buildTodayWeather(
  weather: WeatherSummary[],
  selected?: "jeonbuk" | "jeonnam"
): TodayWeather {
  const pick =
    (selected && weather.find((w) => w.region === selected)) ??
    weather[0];

  const today = pick?.days[0];
  if (!today) {
    return {
      temp: 0,
      rainMm: 0,
      pop: 0,
      clouds: 0,
      description: "정보 없음",
      label: "오늘",
    };
  }

  return {
    temp: today.tempAvg,
    rainMm: today.rainMm,
    pop: today.pop,
    clouds: today.clouds ?? estimateClouds(today.description, today.pop),
    description: today.description,
    label: today.label,
  };
}

function estimateClouds(description: string, pop: number): number {
  if (description.includes("맑")) return 15;
  if (description.includes("흐")) return 75;
  if (description.includes("구름")) return 55;
  if (pop >= 60) return 85;
  if (pop >= 30) return 50;
  return 30;
}
