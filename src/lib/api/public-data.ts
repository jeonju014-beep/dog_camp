import {
  GO_CAMPING_BASE,
  MOBILE_APP,
  MOBILE_OS,
  PET_TOUR_BASE,
  REGIONS,
} from "@/lib/constants";
import {
  calcCampingSiteScore,
  parseAllowedSize,
  parseEnvironment,
  parseGroundType,
  parsePetFacilities,
} from "@/lib/utils/camping-score";
import { isJeollaAddress, regionFromAddress } from "@/lib/utils/region";
import type { CampingItem, PetTourItem, RegionId } from "@/types";
import { fetchJson } from "@/lib/utils/fetch-json";

const JEOLLA_CENTER = { mapX: 127.0, mapY: 35.3, radius: 120000 };

function buildUrl(
  base: string,
  path: string,
  params: Record<string, string | number>
): string {
  const key = process.env.PUBLIC_DATA_SERVICE_KEY;
  if (!key) throw new Error("PUBLIC_DATA_SERVICE_KEY is not set");

  const search = new URLSearchParams({
    serviceKey: key.includes("%") ? decodeURIComponent(key) : key,
    MobileOS: MOBILE_OS,
    MobileApp: MOBILE_APP,
    _type: "json",
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ),
  });

  return `${base}${path}?${search.toString()}`;
}

function parseCampingItem(
  item: Record<string, unknown>,
  idx: number,
  regionFilter?: RegionId
): CampingItem | null {
  const addr = String(item.addr1 ?? "");
  const doNm = item.doNm ? String(item.doNm) : undefined;

  if (!isJeollaAddress(addr, doNm)) return null;

  const region = regionFromAddress(addr, doNm);
  if (!region) return null;
  if (regionFilter && region !== regionFilter) return null;

  const mapX = parseFloat(String(item.mapX ?? ""));
  const mapY = parseFloat(String(item.mapY ?? ""));
  if (!Number.isFinite(mapX) || !Number.isFinite(mapY)) return null;

  const score = calcCampingSiteScore(
    {
      animalCmgCl: item.animalCmgCl ? String(item.animalCmgCl) : undefined,
      sbrsCl: item.sbrsCl ? String(item.sbrsCl) : undefined,
      themaEnvrnCl: item.themaEnvrnCl ? String(item.themaEnvrnCl) : undefined,
      lctCl: item.lctCl ? String(item.lctCl) : undefined,
    },
    undefined
  );

  return {
    id: String(item.contentId ?? item.facltId ?? `camp-${idx}`),
    name: String(item.facltNm ?? "이름 없음"),
    address: addr + (item.addr2 ? ` ${item.addr2}` : ""),
    tel: item.tel ? String(item.tel) : undefined,
    image: item.firstImageUrl ? String(item.firstImageUrl) : undefined,
    intro: item.intro ? String(item.intro) : undefined,
    region,
    lat: mapY,
    lon: mapX,
    allowedSize: parseAllowedSize(
      item.animalCmgCl ? String(item.animalCmgCl) : undefined
    ),
    petFacilities: parsePetFacilities(
      item.sbrsCl ? String(item.sbrsCl) : undefined
    ),
    environment: parseEnvironment(
      item.themaEnvrnCl ? String(item.themaEnvrnCl) : undefined,
      item.lctCl ? String(item.lctCl) : undefined
    ),
    groundType: parseGroundType(item),
    score,
    markerTier: score >= 70 ? "high" : "low",
    isBestSpot: false,
    rank: 0,
    todayTemp: 0,
    todayPop: 0,
    weatherDays: [],
  };
}

export async function fetchCampingList(
  regionFilter?: RegionId,
  numOfRows = 100
): Promise<CampingItem[]> {
  const all: CampingItem[] = [];

  for (const pageNo of [1, 2]) {
    const url = buildUrl(GO_CAMPING_BASE, "/locationBasedList", {
      mapX: JEOLLA_CENTER.mapX,
      mapY: JEOLLA_CENTER.mapY,
      radius: JEOLLA_CENTER.radius,
      numOfRows,
      pageNo,
    });

    const json = await fetchJson<Record<string, unknown>>(url, {
      cache: "no-store",
    });
    const header = (json as { response?: { header?: { resultCode?: string; resultMsg?: string } } })
      .response?.header;
    const code = header?.resultCode;
    if (code && code !== "0000") {
      throw new Error(header?.resultMsg ?? "GoCamping error");
    }

    const bodyItems = (json as { response?: { body?: { items?: { item?: unknown } | unknown[] } } })
      .response?.body?.items;
    const items =
      (bodyItems && !Array.isArray(bodyItems) ? bodyItems.item : bodyItems) ??
      [];

    const list = Array.isArray(items) ? items : items ? [items] : [];

    for (let idx = 0; idx < list.length; idx++) {
      const parsed = parseCampingItem(
        list[idx] as Record<string, unknown>,
        all.length + idx,
        regionFilter
      );
      if (parsed) all.push(parsed);
    }
  }

  const seen = new Set<string>();
  return all.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
}

export async function fetchPetTourList(
  areaCode: "37" | "38",
  numOfRows = 50
): Promise<PetTourItem[]> {
  const url = buildUrl(PET_TOUR_BASE, "/areaBasedList2", {
    areaCode,
    numOfRows,
    pageNo: 1,
  });

  const json = await fetchJson<Record<string, unknown>>(url, {
    cache: "no-store",
  });
  const bodyItems = (json as { response?: { body?: { items?: { item?: unknown } | unknown[] } } })
    .response?.body?.items;
  const items =
    (bodyItems && !Array.isArray(bodyItems) ? bodyItems.item : bodyItems) ??
    [];

  const list = Array.isArray(items) ? items : items ? [items] : [];
  const region: RegionId = areaCode === "38" ? "jeonnam" : "jeonbuk";

  return list.map((item: Record<string, unknown>, idx: number) => ({
    id: String(item.contentid ?? item.contentId ?? `pet-${idx}`),
    title: String(item.title ?? "이름 없음"),
    addr: String(item.addr1 ?? item.addr2 ?? ""),
    cat3: item.cat3 ? String(item.cat3) : undefined,
    tel: item.tel ? String(item.tel) : undefined,
    image: item.firstimage ? String(item.firstimage) : undefined,
    region,
  }));
}

export function getRegionMeta(areaCode: "37" | "38") {
  return REGIONS.find((r) => r.areaCode === areaCode);
}
