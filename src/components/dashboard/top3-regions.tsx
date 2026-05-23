import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RegionScore } from "@/types";
import { Trophy } from "lucide-react";

export function Top3Regions({ top3 }: { top3: RegionScore[] }) {
  if (top3.length === 0) return null;

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Trophy className="h-4 w-4 text-amber-500" />
        <CardTitle>추천 지역 TOP3</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-3">
          {top3.map((r, i) => (
            <div
              key={r.region}
              className="rounded-lg border border-slate-100 bg-slate-50/50 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{medals[i] ?? "•"}</span>
                <Badge variant={i === 0 ? "success" : "muted"}>
                  {r.score.total}점
                </Badge>
              </div>
              <p className="mt-2 font-semibold text-slate-900">{r.name}</p>
              <ul className="mt-2 space-y-1 text-xs text-slate-600">
                <li>캠핑 {r.campingCount}곳 · 반려 {r.petCount}곳</li>
                <li>
                  세부: 캠핑 {r.score.camping} / 반려 {r.score.petPlaces} /
                  날씨 {r.score.weather} / 완성도 {r.score.completeness}
                </li>
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
