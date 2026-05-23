import type { CampingItem } from "@/types";
import { EmptyState } from "@/components/ui/empty-state";

export function CampingTable({ camps }: { camps: CampingItem[] }) {
  if (camps.length === 0) {
    return (
      <EmptyState
        title="표시할 캠핑장이 없습니다"
        description="전북·전남 주소의 캠핑장만 지도에 표시됩니다."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-amber-200/60 bg-white">
      <table className="w-full min-w-[960px] text-left text-sm">
        <thead>
          <tr className="border-b border-amber-100 bg-amber-50/80 text-xs font-semibold uppercase tracking-wide text-amber-900/80">
            <th className="px-4 py-3">순위</th>
            <th className="px-4 py-3">캠핑장명</th>
            <th className="px-4 py-3">주소</th>
            <th className="px-4 py-3">추천지수</th>
            <th className="px-4 py-3">허용크기</th>
            <th className="px-4 py-3">반려견시설</th>
            <th className="px-4 py-3">기온</th>
            <th className="px-4 py-3">강수확률</th>
            <th className="px-4 py-3">지면</th>
            <th className="px-4 py-3">명당</th>
          </tr>
        </thead>
        <tbody>
          {camps.map((c) => (
            <tr
              key={c.id}
              className="border-b border-stone-100 transition-colors hover:bg-amber-50/40"
            >
              <td className="px-4 py-3 font-medium text-stone-700">{c.rank}</td>
              <td className="px-4 py-3 font-semibold text-stone-900">{c.name}</td>
              <td className="max-w-[200px] truncate px-4 py-3 text-stone-600">
                {c.address}
              </td>
              <td className="px-4 py-3">
                <span
                  className={
                    c.score >= 70
                      ? "font-bold text-amber-700"
                      : "text-stone-500"
                  }
                >
                  {c.score}
                </span>
              </td>
              <td className="px-4 py-3 text-stone-600">{c.allowedSize}</td>
              <td className="max-w-[160px] truncate px-4 py-3 text-stone-600">
                {c.petFacilities.join(", ")}
              </td>
              <td className="px-4 py-3">{c.todayTemp}°C</td>
              <td className="px-4 py-3">{c.todayPop}%</td>
              <td className="px-4 py-3 text-stone-600">{c.groundType}</td>
              <td className="px-4 py-3">
                {c.isBestSpot ? (
                  <span className="font-medium text-red-600">★ 최고</span>
                ) : (
                  <span className="text-stone-300">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
