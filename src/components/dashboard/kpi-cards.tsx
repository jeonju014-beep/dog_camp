import { Card, CardContent } from "@/components/ui/card";
import type { DashboardData } from "@/types";
import { CloudSun, MapPin, PawPrint, TrendingUp } from "lucide-react";

export function KpiCards({ data }: { data: DashboardData }) {
  const primary =
    data.regions.find((r) => {
      if (data.selectedRegion === "37") return r.region === "jeonbuk";
      if (data.selectedRegion === "38") return r.region === "jeonnam";
      return r.score.total === Math.max(...data.regions.map((x) => x.score.total));
    }) ?? data.regions[0];

  const weather = data.weather[0];

  const items = [
    {
      label: "반려견 캠핑 추천지수",
      value: `${primary?.score.total ?? 0}점`,
      sub: primary?.name ?? "-",
      icon: TrendingUp,
      accent: "text-brand-600 bg-brand-50",
    },
    {
      label: "캠핑장",
      value: `${data.camping.length}곳`,
      sub: `목표 대비 ${primary?.score.camping ?? 0}/30점`,
      icon: MapPin,
      accent: "text-blue-600 bg-blue-50",
    },
    {
      label: "반려동물 동반 장소",
      value: `${data.petTours.length}곳`,
      sub: `목표 대비 ${primary?.score.petPlaces ?? 0}/25점`,
      icon: PawPrint,
      accent: "text-violet-600 bg-violet-50",
    },
    {
      label: "5일 날씨 요약",
      value: weather ? `${weather.avgTemp}°C` : "-",
      sub: weather
        ? `강수일 ${weather.rainyDays}일 · 쾌적 ${weather.goodTempDays}일`
        : "데이터 없음",
      icon: CloudSun,
      accent: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="flex items-start gap-4">
            <div className={`rounded-lg p-2.5 ${item.accent}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">{item.label}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {item.value}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">{item.sub}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
