import { Badge } from "@/components/ui/badge";
import type { DashboardData } from "@/types";
import { AlertCircle, Database } from "lucide-react";

export function DataSourceBanner({ data }: { data: DashboardData }) {
  const variant =
    data.dataSource === "live"
      ? "success"
      : data.dataSource === "mixed"
        ? "warning"
        : "warning";

  const label =
    data.dataSource === "live"
      ? "실시간 API"
      : data.dataSource === "mixed"
        ? "일부 Mock"
        : "Mock 데이터";

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-amber-200/60 bg-white/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Database className="h-4 w-4 text-slate-500" />
        <span className="text-sm text-slate-600">데이터 출처</span>
        <Badge variant={variant}>{label}</Badge>
      </div>
      {data.errors.length > 0 && (
        <div className="flex items-start gap-2 text-xs text-amber-800">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p className="line-clamp-2">{data.errors.join(" · ")}</p>
        </div>
      )}
    </div>
  );
}
