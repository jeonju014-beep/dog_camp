import type { ScoreBreakdown, WeatherSummary } from "@/types";
import {
  SCORE_CAMPING_BASE,
  SCORE_PET_BASE,
} from "@/lib/constants";

export function calcCampingScore(count: number): number {
  return Math.min(count / SCORE_CAMPING_BASE, 1) * 30;
}

export function calcPetScore(count: number): number {
  return Math.min(count / SCORE_PET_BASE, 1) * 25;
}

export function calcWeatherScore(weather: WeatherSummary | undefined): number {
  if (!weather || weather.days.length === 0) return 12;

  const days = weather.days;
  const n = days.length;

  const noRainRatio =
    days.filter((d) => d.rainMm < 0.5 && d.pop < 40).length / n;
  const goodTempRatio = weather.goodTempDays / n;

  let penalty = 0;
  for (const d of days) {
    if (d.tempMax >= 33 || d.tempMin <= -5) penalty += 1.5;
    if (d.windMax >= 10) penalty += 0.5;
  }
  penalty = Math.min(penalty, 6);

  const raw = noRainRatio * 12 + goodTempRatio * 12 + (12 - penalty);
  return Math.max(0, Math.min(30, Math.round(raw)));
}

export function calcCompletenessScore(flags: {
  camping: boolean;
  pet: boolean;
  weather: boolean;
}): number {
  const ok = [flags.camping, flags.pet, flags.weather].filter(Boolean).length;
  return Math.round((ok / 3) * 15);
}

export function buildScore(
  campingCount: number,
  petCount: number,
  weather: WeatherSummary | undefined,
  completenessFlags: { camping: boolean; pet: boolean; weather: boolean }
): ScoreBreakdown {
  const camping = Math.round(calcCampingScore(campingCount));
  const petPlaces = Math.round(calcPetScore(petCount));
  const weatherScore = calcWeatherScore(weather);
  const completeness = calcCompletenessScore(completenessFlags);
  const total = Math.min(
    100,
    Math.round(camping + petPlaces + weatherScore + completeness)
  );

  return { camping, petPlaces, weather: weatherScore, completeness, total };
}
