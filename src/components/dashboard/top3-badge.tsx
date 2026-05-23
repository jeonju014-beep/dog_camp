import type { RegionScore } from "@/types";

const MEDALS = ["🥇", "🥈", "🥉"];

export function Top3Badge({ top3 }: { top3: RegionScore[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {top3.map((r, i) => (
        <div
          key={r.region}
          className="flex items-center gap-2 rounded-full border border-amber-200 bg-white/90 px-3 py-1.5 text-sm shadow-sm"
        >
          <span>{MEDALS[i]}</span>
          <span className="font-medium text-stone-800">{r.name}</span>
          <span className="font-bold text-amber-700">{r.score.total}점</span>
        </div>
      ))}
    </div>
  );
}
