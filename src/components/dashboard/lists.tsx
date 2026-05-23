import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { CampingItem, PetTourItem, WeatherSummary } from "@/types";
import { Tent, PawPrint } from "lucide-react";

export function CampingList({ items }: { items: CampingItem[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Tent className="h-4 w-4 text-brand-600" />
        <CardTitle>캠핑장 목록</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState
            title="캠핑장이 없습니다"
            description="지역 필터를 변경하거나 API 키를 확인해 주세요."
          />
        ) : (
          <ul className="max-h-80 space-y-3 overflow-y-auto pr-1">
            {items.map((c) => (
              <li
                key={c.id}
                className="rounded-lg border border-slate-100 p-3 hover:bg-slate-50/80"
              >
                <p className="font-medium text-slate-900">{c.name}</p>
                <p className="mt-1 text-xs text-slate-500">{c.address}</p>
                {c.intro && (
                  <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                    {c.intro}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export function PetTourList({ items }: { items: PetTourItem[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <PawPrint className="h-4 w-4 text-violet-600" />
        <CardTitle>반려동물 동반 여행지</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState
            title="여행지가 없습니다"
            description="반려동물 동반여행 API 응답을 확인해 주세요."
          />
        ) : (
          <ul className="max-h-80 space-y-3 overflow-y-auto pr-1">
            {items.map((p) => (
              <li
                key={p.id}
                className="rounded-lg border border-slate-100 p-3 hover:bg-slate-50/80"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-slate-900">{p.title}</p>
                  {p.cat3 && (
                    <span className="shrink-0 rounded bg-violet-50 px-2 py-0.5 text-xs text-violet-700">
                      {p.cat3}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-500">{p.addr}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export function WeatherCards({ weather }: { weather: WeatherSummary[] }) {
  if (weather.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>5일 날씨 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="날씨 정보 없음" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {weather.map((w) => (
        <Card key={w.region}>
          <CardHeader>
            <CardTitle>
              {w.city} · 5일 예보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {w.days.map((d) => (
                <div
                  key={d.date}
                  className="rounded-lg bg-slate-50 p-2 text-center text-xs"
                >
                  <p className="font-medium text-slate-700">{d.label}</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {d.tempAvg}°
                  </p>
                  <p className="text-slate-500">{d.description}</p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {d.pop}% · {d.rainMm}mm
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
