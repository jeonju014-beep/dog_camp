"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { DashboardData, RegionCode } from "@/types";
import { Loader2, RefreshCw } from "lucide-react";

function parseRegion(value: string | null): RegionCode {
  if (value === "37" || value === "38" || value === "all") return value;
  return "all";
}

export function DashboardClient() {
  const searchParams = useSearchParams();
  const region = parseRegion(searchParams.get("region"));
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/dashboard?region=${region}`, {
        cache: "no-store",
      });
      const json = await res.json();
      if (!json.success || !json.data) {
        throw new Error(json.error ?? "데이터를 불러오지 못했습니다.");
      }
      setData(json.data);
    } catch (e) {
      setError((e as Error).message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [region]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF7F2]">
        <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
        <p className="mt-4 text-sm text-stone-600">캠핑 지도 데이터 불러오는 중...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FAF7F2] px-4">
        <p className="text-center text-stone-700">
          {error ?? "알 수 없는 오류가 발생했습니다."}
        </p>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
        >
          <RefreshCw className="h-4 w-4" />
          다시 시도
        </button>
      </div>
    );
  }

  return <DashboardShell data={data} />;
}
