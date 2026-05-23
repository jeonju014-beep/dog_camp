export type RegionCode = "37" | "38" | "all";

export type RegionId = "jeonbuk" | "jeonnam";

export type MarkerTier = "best" | "high" | "low";

export interface RegionMeta {
  id: RegionId;
  name: string;
  areaCode: "37" | "38";
  lat: number;
  lon: number;
}

export interface CampingItem {
  id: string;
  name: string;
  address: string;
  tel?: string;
  image?: string;
  intro?: string;
  region: RegionId;
  lat: number;
  lon: number;
  allowedSize: string;
  petFacilities: string[];
  environment: string;
  groundType: string;
  score: number;
  markerTier: MarkerTier;
  isBestSpot: boolean;
  rank: number;
  todayTemp: number;
  todayPop: number;
  weatherDays: WeatherDay[];
}

export interface PetTourItem {
  id: string;
  title: string;
  addr: string;
  cat3?: string;
  tel?: string;
  image?: string;
  region: RegionId;
}

export interface WeatherDay {
  date: string;
  label: string;
  tempMin: number;
  tempMax: number;
  tempAvg: number;
  rainMm: number;
  pop: number;
  windMax: number;
  description: string;
  clouds?: number;
}

export interface TodayWeather {
  temp: number;
  rainMm: number;
  pop: number;
  clouds: number;
  description: string;
  label: string;
}

export interface WeatherSummary {
  region: RegionId;
  city: string;
  days: WeatherDay[];
  avgTemp: number;
  rainyDays: number;
  goodTempDays: number;
}

export interface ScoreBreakdown {
  camping: number;
  petPlaces: number;
  weather: number;
  completeness: number;
  total: number;
}

export interface RegionScore {
  region: RegionId;
  name: string;
  score: ScoreBreakdown;
  campingCount: number;
  petCount: number;
}

export interface PetTypeStat {
  name: string;
  value: number;
}

export interface DashboardData {
  selectedRegion: RegionCode;
  regions: RegionScore[];
  top3: RegionScore[];
  camping: CampingItem[];
  petTours: PetTourItem[];
  weather: WeatherSummary[];
  todayWeather: TodayWeather;
  petTypeStats: PetTypeStat[];
  weatherChart: { date: string; jeonbuk: number; jeonnam: number }[];
  dataSource: "live" | "mock" | "mixed";
  errors: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  source: "live" | "mock";
  error?: string;
}
