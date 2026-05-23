import type {
  CampingItem,
  DashboardData,
  PetTourItem,
  RegionScore,
  WeatherSummary,
} from "@/types";
import { buildScore } from "@/lib/utils/score";
import {
  buildTodayWeather,
  enrichCampingList,
} from "@/lib/utils/enrich-camping";

function baseCamp(
  partial: Omit<
    CampingItem,
    | "score"
    | "markerTier"
    | "isBestSpot"
    | "rank"
    | "todayTemp"
    | "todayPop"
    | "weatherDays"
  > &
    Partial<Pick<CampingItem, "score">>
): CampingItem {
  return {
    ...partial,
    score: partial.score ?? 75,
    markerTier: "high",
    isBestSpot: false,
    rank: 0,
    todayTemp: 20,
    todayPop: 20,
    weatherDays: [],
  };
}

const mockCampingJeonbuk: CampingItem[] = [
  baseCamp({
    id: "jb-1",
    name: "무주 덕유산 오토캠핑장",
    address: "전북특별자치도 무주군 설천면",
    tel: "063-000-0001",
    region: "jeonbuk",
    lat: 35.89,
    lon: 127.73,
    allowedSize: "가능(소형견)",
    petFacilities: ["반려견 놀이터", "샤워실", "산책로"],
    environment: "숲 · 계곡",
    groundType: "잔디, 데크",
    score: 82,
  }),
  baseCamp({
    id: "jb-2",
    name: "고창 갯벌 오토캠핑",
    address: "전북특별자치도 고창군 심원면",
    region: "jeonbuk",
    lat: 35.53,
    lon: 126.54,
    allowedSize: "가능(대형견)",
    petFacilities: ["펫존", "매점", "온수"],
    environment: "갯벌 · 해변",
    groundType: "모래, 잔디",
    score: 78,
  }),
  baseCamp({
    id: "jb-3",
    name: "남원 지리산 힐링캠프",
    address: "전북특별자치도 남원시",
    region: "jeonbuk",
    lat: 35.41,
    lon: 127.39,
    allowedSize: "가능(소형견)",
    petFacilities: ["산책로", "장작판매"],
    environment: "산 · 국립공원",
    groundType: "잔디",
    score: 65,
  }),
];

const mockCampingJeonnam: CampingItem[] = [
  baseCamp({
    id: "jn-1",
    name: "여수 돌산 캠핑파크",
    address: "전라남도 여수시 돌산읍",
    tel: "061-000-0001",
    region: "jeonnam",
    lat: 34.72,
    lon: 127.74,
    allowedSize: "가능(소형견)",
    petFacilities: ["해변 산책", "펫 샤워장"],
    environment: "해안 · 섬",
    groundType: "데크, 자갈",
    score: 88,
  }),
  baseCamp({
    id: "jn-2",
    name: "순천만 갯벌 캠핑장",
    address: "전라남도 순천시",
    region: "jeonnam",
    lat: 34.93,
    lon: 127.52,
    allowedSize: "가능(중형견)",
    petFacilities: ["생태탐방로", "매점"],
    environment: "갯벌 · 습지",
    groundType: "잔디",
    score: 74,
  }),
  baseCamp({
    id: "jn-3",
    name: "담양 죽녹원 캠핑",
    address: "전라남도 담양군",
    region: "jeonnam",
    lat: 35.32,
    lon: 126.99,
    allowedSize: "가능(소형견)",
    petFacilities: ["대나무 숲 산책"],
    environment: "숲 · 계곡",
    groundType: "잔디, 흙",
    score: 68,
  }),
  baseCamp({
    id: "jn-4",
    name: "보성 녹차밭 오토캠핑",
    address: "전라남도 보성군",
    region: "jeonnam",
    lat: 34.77,
    lon: 127.08,
    allowedSize: "불가능",
    petFacilities: ["전망대", "카페"],
    environment: "녹차밭 · 산",
    groundType: "흙, 자갈",
    score: 55,
  }),
];

const mockPetJeonbuk: PetTourItem[] = [
  {
    id: "pjb-1",
    title: "전주 한옥마을 반려견 산책코스",
    addr: "전라북도 전주시",
    cat3: "문화시설",
    region: "jeonbuk",
  },
  {
    id: "pjb-2",
    title: "군산 근대역사 pet-friendly 카페거리",
    addr: "전라북도 군산시",
    cat3: "음식",
    region: "jeonbuk",
  },
];

const mockPetJeonnam: PetTourItem[] = [
  {
    id: "pjn-1",
    title: "순천만 국가정원 반려동물 동반",
    addr: "전라남도 순천시",
    cat3: "자연",
    region: "jeonnam",
  },
  {
    id: "pjn-2",
    title: "여수 오동도 해안 산책",
    addr: "전라남도 여수시",
    cat3: "자연",
    region: "jeonnam",
  },
  {
    id: "pjn-3",
    title: "목포 해상케이블카 pet zone",
    addr: "전라남도 목포시",
    cat3: "레저",
    region: "jeonnam",
  },
  {
    id: "pjn-4",
    title: "강진 다원림 카페 & 펫존",
    addr: "전라남도 강진군",
    cat3: "음식",
    region: "jeonnam",
  },
];

function mockWeather(region: "jeonbuk" | "jeonnam", city: string): WeatherSummary {
  const base =
    region === "jeonbuk"
      ? [
          { t: 18, rain: 0, pop: 10, clouds: 20 },
          { t: 20, rain: 0, pop: 5, clouds: 15 },
          { t: 22, rain: 0.2, pop: 30, clouds: 45 },
          { t: 19, rain: 0, pop: 15, clouds: 25 },
          { t: 17, rain: 0, pop: 20, clouds: 30 },
        ]
      : [
          { t: 21, rain: 0, pop: 10, clouds: 18 },
          { t: 23, rain: 0, pop: 5, clouds: 12 },
          { t: 24, rain: 0, pop: 15, clouds: 35 },
          { t: 22, rain: 0.1, pop: 25, clouds: 50 },
          { t: 20, rain: 0, pop: 10, clouds: 22 },
        ];

  const today = new Date();
  const days = base.map((b, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    return {
      date: iso,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      tempMin: b.t - 3,
      tempMax: b.t + 4,
      tempAvg: b.t,
      rainMm: b.rain,
      pop: b.pop,
      windMax: 3.5,
      description: b.rain > 0 ? "약한 비" : "맑음",
      clouds: b.clouds,
    };
  });

  return {
    region,
    city,
    days,
    avgTemp: Math.round(days.reduce((a, d) => a + d.tempAvg, 0) / days.length),
    rainyDays: days.filter((d) => d.rainMm >= 0.5 || d.pop >= 50).length,
    goodTempDays: days.filter((d) => d.tempAvg >= 15 && d.tempAvg <= 25).length,
  };
}

function buildRegionScores(): RegionScore[] {
  const weatherJb = mockWeather("jeonbuk", "전주");
  const weatherJn = mockWeather("jeonnam", "여수");

  return [
    {
      region: "jeonbuk",
      name: "전라북도",
      campingCount: mockCampingJeonbuk.length,
      petCount: mockPetJeonbuk.length,
      score: buildScore(
        mockCampingJeonbuk.length,
        mockPetJeonbuk.length,
        weatherJb,
        { camping: true, pet: true, weather: true }
      ),
    },
    {
      region: "jeonnam",
      name: "전라남도",
      campingCount: mockCampingJeonnam.length,
      petCount: mockPetJeonnam.length,
      score: buildScore(
        mockCampingJeonnam.length,
        mockPetJeonnam.length,
        weatherJn,
        { camping: true, pet: true, weather: true }
      ),
    },
  ];
}

export function getMockDashboard(
  selectedRegion: "37" | "38" | "all" = "all"
): DashboardData {
  const regions = buildRegionScores();
  const top3 = [...regions].sort((a, b) => b.score.total - a.score.total).slice(0, 3);

  const weatherJb = mockWeather("jeonbuk", "전주");
  const weatherJn = mockWeather("jeonnam", "여수");
  const weatherByRegion = { jeonbuk: weatherJb, jeonnam: weatherJn };

  const filterRegion = (r: "jeonbuk" | "jeonnam") => {
    if (selectedRegion === "37") return r === "jeonbuk";
    if (selectedRegion === "38") return r === "jeonnam";
    return true;
  };

  const rawCamping = [...mockCampingJeonbuk, ...mockCampingJeonnam].filter((c) =>
    filterRegion(c.region)
  );
  const camping = enrichCampingList(rawCamping, weatherByRegion);
  const petTours = [...mockPetJeonbuk, ...mockPetJeonnam].filter((p) =>
    filterRegion(p.region)
  );
  const weather = [weatherJb, weatherJn].filter((w) => filterRegion(w.region));

  const petTypeMap = new Map<string, number>();
  for (const p of petTours) {
    const key = p.cat3 ?? "기타";
    petTypeMap.set(key, (petTypeMap.get(key) ?? 0) + 1);
  }

  const weatherChart = weatherJb.days.map((d, i) => ({
    date: d.label,
    jeonbuk: weatherJb.days[i]?.tempAvg ?? 0,
    jeonnam: weatherJn.days[i]?.tempAvg ?? 0,
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
    dataSource: "mock",
    errors: ["Mock 데이터를 표시 중입니다. API 키를 .env.local에 설정하세요."],
  };
}
