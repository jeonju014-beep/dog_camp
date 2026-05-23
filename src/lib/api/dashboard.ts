import { fetchCampingList, fetchPetTourList } from "@/lib/api/public-data";
import { fetchWeatherForecast } from "@/lib/api/openweather";
import { REGIONS } from "@/lib/constants";
import { getMockDashboard } from "@/lib/mock/data";
import { buildScore } from "@/lib/utils/score";
import {
  buildTodayWeather,
  enrichCampingList,
} from "@/lib/utils/enrich-camping";
import type {
  DashboardData,
  RegionCode,
  RegionId,
  RegionScore,
  WeatherSummary,
} from "@/types";

export async function buildDashboard(
  selectedRegion: RegionCode = "all"
): Promise<DashboardData> {
  const errors: string[] = [];
  let usedMock = false;
  let anyLive = false;

  const campingByRegion: Record<RegionId, Awaited<ReturnType<typeof fetchCampingList>>> = {
    jeonbuk: [],
    jeonnam: [],
  };
  const petByRegion: Record<RegionId, Awaited<ReturnType<typeof fetchPetTourList>>> = {
    jeonbuk: [],
    jeonnam: [],
  };
  const weatherByRegion: Record<RegionId, WeatherSummary | undefined> = {
    jeonbuk: undefined,
    jeonnam: undefined,
  };

  const flags: Record<RegionId, { camping: boolean; pet: boolean; weather: boolean }> = {
    jeonbuk: { camping: false, pet: false, weather: false },
    jeonnam: { camping: false, pet: false, weather: false },
  };

  try {
    const allCamps = await fetchCampingList(undefined, 100);
    campingByRegion.jeonbuk = allCamps.filter((c) => c.region === "jeonbuk");
    campingByRegion.jeonnam = allCamps.filter((c) => c.region === "jeonnam");
    flags.jeonbuk.camping = campingByRegion.jeonbuk.length > 0;
    flags.jeonnam.camping = campingByRegion.jeonnam.length > 0;
    anyLive = allCamps.length > 0;
  } catch (e) {
    errors.push(`캠핑: ${(e as Error).message}`);
  }

  for (const meta of REGIONS) {
    const rid = meta.id;

    try {
      petByRegion[rid] = await fetchPetTourList(meta.areaCode);
      flags[rid].pet = petByRegion[rid].length > 0;
      anyLive = true;
    } catch (e) {
      errors.push(`반려여행(${meta.name}): ${(e as Error).message}`);
    }

    try {
      weatherByRegion[rid] = await fetchWeatherForecast(
        meta.lat,
        meta.lon,
        rid,
        meta.name
      );
      flags[rid].weather = true;
      anyLive = true;
    } catch (e) {
      errors.push(`날씨(${meta.name}): ${(e as Error).message}`);
    }
  }

  const noData =
    !flags.jeonbuk.camping &&
    !flags.jeonnam.camping &&
    !flags.jeonbuk.pet &&
    !flags.jeonnam.pet;

  if (noData && !anyLive) {
    return getMockDashboard(selectedRegion);
  }

  const mock = getMockDashboard("all");

  if (campingByRegion.jeonbuk.length === 0)
    campingByRegion.jeonbuk = mock.camping.filter((c) => c.region === "jeonbuk");
  if (campingByRegion.jeonnam.length === 0)
    campingByRegion.jeonnam = mock.camping.filter((c) => c.region === "jeonnam");
  if (petByRegion.jeonbuk.length === 0)
    petByRegion.jeonbuk = mock.petTours.filter((p) => p.region === "jeonbuk");
  if (petByRegion.jeonnam.length === 0)
    petByRegion.jeonnam = mock.petTours.filter((p) => p.region === "jeonnam");
  if (!weatherByRegion.jeonbuk)
    weatherByRegion.jeonbuk = mock.weather.find((w) => w.region === "jeonbuk");
  if (!weatherByRegion.jeonnam)
    weatherByRegion.jeonnam = mock.weather.find((w) => w.region === "jeonnam");

  if (!flags.jeonbuk.camping || !flags.jeonnam.camping) usedMock = true;

  const regions: RegionScore[] = REGIONS.map((meta) => {
    const rid = meta.id;
    return {
      region: rid,
      name: meta.name,
      campingCount: campingByRegion[rid].length,
      petCount: petByRegion[rid].length,
      score: buildScore(
        campingByRegion[rid].length,
        petByRegion[rid].length,
        weatherByRegion[rid],
        flags[rid]
      ),
    };
  });

  const top3 = [...regions].sort((a, b) => b.score.total - a.score.total).slice(0, 3);

  const filterRegion = (r: RegionId) => {
    if (selectedRegion === "37") return r === "jeonbuk";
    if (selectedRegion === "38") return r === "jeonnam";
    return true;
  };

  const rawCamping = [...campingByRegion.jeonbuk, ...campingByRegion.jeonnam].filter(
    (c) => filterRegion(c.region)
  );
  const camping = enrichCampingList(rawCamping, weatherByRegion);

  const petTours = [...petByRegion.jeonbuk, ...petByRegion.jeonnam].filter((p) =>
    filterRegion(p.region)
  );
  const weather = [weatherByRegion.jeonbuk, weatherByRegion.jeonnam].filter(
    (w): w is WeatherSummary => !!w && filterRegion(w.region)
  );

  const petTypeMap = new Map<string, number>();
  for (const p of petTours) {
    const key = p.cat3 ?? "기타";
    petTypeMap.set(key, (petTypeMap.get(key) ?? 0) + 1);
  }

  const jbDays = weatherByRegion.jeonbuk?.days ?? [];
  const jnDays = weatherByRegion.jeonnam?.days ?? [];
  const maxLen = Math.max(jbDays.length, jnDays.length, 1);
  const weatherChart = Array.from({ length: maxLen }, (_, i) => ({
    date: jbDays[i]?.label ?? jnDays[i]?.label ?? `D+${i}`,
    jeonbuk: jbDays[i]?.tempAvg ?? 0,
    jeonnam: jnDays[i]?.tempAvg ?? 0,
  }));

  const todayRegion =
    selectedRegion === "37"
      ? "jeonbuk"
      : selectedRegion === "38"
        ? "jeonnam"
        : undefined;

  return {
    selectedRegion,
    regions,
    top3,
    camping,
    petTours,
    weather,
    todayWeather: buildTodayWeather(weather, todayRegion),
    petTypeStats: [...petTypeMap.entries()].map(([name, value]) => ({
      name,
      value,
    })),
    weatherChart,
    dataSource: usedMock ? (anyLive ? "mixed" : "mock") : "live",
    errors,
  };
}
