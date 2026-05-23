import type { RegionMeta } from "@/types";

export const REGIONS: RegionMeta[] = [
  {
    id: "jeonbuk",
    name: "전라북도",
    areaCode: "37",
    lat: 35.82,
    lon: 127.15,
  },
  {
    id: "jeonnam",
    name: "전라남도",
    areaCode: "38",
    lat: 34.82,
    lon: 126.89,
  },
];

export const MAP_CENTER: [number, number] = [35.35, 127.1];
export const MAP_ZOOM = 8;

export const MOBILE_OS = "ETC";
export const MOBILE_APP = "PetCampingDashboard";

export const GO_CAMPING_BASE =
  "https://apis.data.go.kr/B551011/GoCamping";
export const PET_TOUR_BASE =
  "https://apis.data.go.kr/B551011/KorPetTourService2";
export const OPENWEATHER_FORECAST =
  "https://api.openweathermap.org/data/2.5/forecast";

export const SCORE_CAMPING_BASE = 30;
export const SCORE_PET_BASE = 40;
