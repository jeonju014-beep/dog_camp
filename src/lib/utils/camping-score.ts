import type { WeatherSummary } from "@/types";

interface CampingRaw {
  animalCmgCl?: string;
  sbrsCl?: string;
  themaEnvrnCl?: string;
  lctCl?: string;
}

const PET_KEYWORDS = ["반려", "애견", "펫", "동물"];

export function parsePetFacilities(sbrsCl?: string): string[] {
  if (!sbrsCl) return ["기본 편의시설"];
  const all = sbrsCl.split(",").map((s) => s.trim()).filter(Boolean);
  const pet = all.filter((s) =>
    PET_KEYWORDS.some((k) => s.includes(k))
  );
  const picked = pet.length > 0 ? pet : all.slice(0, 4);
  return picked.length > 0 ? picked : ["매점", "화장실", "샤워실"];
}

export function parseAllowedSize(animalCmgCl?: string): string {
  if (!animalCmgCl) return "정보 없음";
  return animalCmgCl;
}

export function parseGroundType(item: Record<string, unknown>): string {
  const parts = [1, 2, 3, 4, 5]
    .map((n) => item[`siteBottomCl${n}`])
    .filter((v) => v && String(v).trim())
    .map(String);
  return parts.length > 0 ? parts.join(", ") : "잔디/데크 혼합";
}

export function parseEnvironment(thema?: string, lct?: string): string {
  const parts = [thema, lct].filter((v) => v && String(v).trim());
  return parts.length > 0 ? parts.join(" · ") : "자연 친화 입지";
}

export function calcCampingSiteScore(
  raw: CampingRaw,
  weather?: WeatherSummary
): number {
  let score = 42;

  const allowed = raw.animalCmgCl ?? "";
  if (/가능|허용/.test(allowed) && !/불가/.test(allowed)) score += 18;
  else if (/소형|중형/.test(allowed)) score += 10;
  else score += 2;

  const facilities = parsePetFacilities(raw.sbrsCl);
  score += Math.min(facilities.length * 2, 12);

  const today = weather?.days[0];
  if (today) {
    if (today.rainMm < 0.5 && today.pop < 40) score += 10;
    if (today.tempAvg >= 15 && today.tempAvg <= 28) score += 10;
    if (today.tempMax >= 33 || today.tempMin <= -2) score -= 6;
    if (today.windMax >= 10) score -= 4;
  }

  if (raw.themaEnvrnCl?.includes("해변") || raw.themaEnvrnCl?.includes("숲")) {
    score += 4;
  }

  return Math.max(35, Math.min(98, Math.round(score)));
}

export function assignMarkerTiers(
  camps: { id: string; score: number }[]
): Map<string, "best" | "high" | "low"> {
  const sorted = [...camps].sort((a, b) => b.score - a.score);
  const tiers = new Map<string, "best" | "high" | "low">();

  if (sorted[0]) tiers.set(sorted[0].id, "best");

  for (const c of camps) {
    if (tiers.get(c.id) === "best") continue;
    tiers.set(c.id, c.score >= 70 ? "high" : "low");
  }

  return tiers;
}
