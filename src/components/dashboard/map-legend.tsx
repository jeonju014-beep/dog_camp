export function MapLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-amber-200/60 bg-white/90 px-4 py-2 text-xs text-stone-600">
      <span className="font-medium text-stone-700">마커</span>
      <span className="flex items-center gap-1.5">
        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[7px] font-bold text-white ring-1 ring-red-700">
          ★
        </span>
        오늘의 최고 캠핑장
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-3.5 w-3.5 rounded-full bg-yellow-200 ring-1 ring-yellow-400" />
        70점 이상
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-3.5 w-3.5 rounded-full bg-slate-300 ring-1 ring-slate-400" />
        70점 미만
      </span>
    </div>
  );
}
