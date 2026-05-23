"use client";

import { Suspense } from "react";
import { RegionFilter } from "@/components/dashboard/region-filter";
import { TodayWeatherCard } from "@/components/dashboard/today-weather";
import { Top3Badge } from "@/components/dashboard/top3-badge";
import { CampingTable } from "@/components/dashboard/camping-table";
import { DashboardCharts } from "@/components/dashboard/charts";
import { DataSourceBanner } from "@/components/dashboard/data-source-banner";
import { MapLegend } from "@/components/dashboard/map-legend";
import { CampingMap } from "@/components/map/camping-map";
import type { DashboardData } from "@/types";
import { Tent, PawPrint } from "lucide-react";

export function DashboardShell({ data }: { data: DashboardData }) {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="border-b border-amber-200/50 bg-[#FFFBF5]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md">
              <PawPrint className="h-6 w-6" />
            </div>
            <div>
              <h1 className="flex items-center gap-2 text-xl font-bold text-stone-800 lg:text-2xl">
                <Tent className="h-6 w-6 text-amber-600" />
                반려견 캠핑 지도 대시보드
              </h1>
              <p className="text-sm text-stone-500">
                전라북도 · 전라남도 캠핑 명당 찾기
              </p>
            </div>
          </div>
          <Suspense
            fallback={
              <div className="h-10 w-48 animate-pulse rounded-lg bg-amber-100" />
            }
          >
            <RegionFilter />
          </Suspense>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] space-y-4 px-4 py-4 lg:px-6 lg:py-6">
        <DataSourceBanner data={data} />
        <Top3Badge top3={data.top3} />

        <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
          <div className="space-y-3">
            <div className="relative">
              <div className="pointer-events-none absolute right-3 top-3 z-[1000] w-72 max-w-[calc(100%-24px)]">
                <div className="pointer-events-auto">
                  <TodayWeatherCard weather={data.todayWeather} />
                </div>
              </div>
              <CampingMap camps={data.camping} />
            </div>
            <MapLegend />
            {data.camping.length === 0 && (
              <p className="rounded-lg bg-amber-100 px-4 py-2 text-sm text-amber-900">
                전북·전남 주소의 캠핑장이 없습니다. 지역 필터를 바꿔 보세요.
              </p>
            )}
          </div>

          <aside className="hidden xl:block">
            <DashboardCharts data={data} />
          </aside>
        </div>

        <div className="xl:hidden">
          <DashboardCharts data={data} />
        </div>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-stone-800">
            추천 캠핑장 리스트 ({data.camping.length}곳)
          </h2>
          <CampingTable camps={data.camping} />
        </section>
      </main>

      <footer className="border-t border-amber-200/40 py-4 text-center text-xs text-stone-400">
        OpenStreetMap · 고캠핑 · 반려동물여행 · OpenWeather
      </footer>
    </div>
  );
}
