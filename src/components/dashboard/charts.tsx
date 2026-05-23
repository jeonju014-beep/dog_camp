"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { DashboardData } from "@/types";

const PIE_COLORS = ["#D97706", "#F59E0B", "#FCD34D", "#A8A29E", "#78716C"];

export function DashboardCharts({ data }: { data: DashboardData }) {
  const barData = data.regions.map((r) => ({
    name: r.name.replace("전라", ""),
    score: r.score.total,
  }));

  return (
    <div className="space-y-4">
      <Card className="border-amber-200/60 bg-white/90">
        <CardHeader className="py-3">
          <CardTitle className="text-amber-900">전북·전남 추천지수</CardTitle>
        </CardHeader>
        <CardContent className="h-52">
          {barData.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FDE68A" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="score" name="추천지수" fill="#D97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="border-amber-200/60 bg-white/90">
        <CardHeader className="py-3">
          <CardTitle className="text-amber-900">5일 기온 변화</CardTitle>
        </CardHeader>
        <CardContent className="h-52">
          {data.weatherChart.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.weatherChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FDE68A" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} unit="°" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="jeonbuk" name="전북" stroke="#D97706" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="jeonnam" name="전남" stroke="#B45309" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="border-amber-200/60 bg-white/90">
        <CardHeader className="py-3">
          <CardTitle className="text-amber-900">반려 시설 유형</CardTitle>
        </CardHeader>
        <CardContent className="h-52">
          {data.petTypeStats.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.petTypeStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {data.petTypeStats.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="border-amber-200/60 bg-white/90">
        <CardHeader className="py-3">
          <CardTitle className="text-amber-900">반려동물 동반 여행지</CardTitle>
        </CardHeader>
        <CardContent>
          {data.petTours.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="max-h-48 space-y-2 overflow-y-auto text-xs">
              {data.petTours.slice(0, 12).map((p) => (
                <li
                  key={p.id}
                  className="rounded-lg border border-amber-100 bg-amber-50/50 px-2 py-1.5"
                >
                  <p className="font-medium text-stone-800">{p.title}</p>
                  <p className="text-stone-500">{p.addr}</p>
                  {p.cat3 && (
                    <span className="text-amber-700">{p.cat3}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
