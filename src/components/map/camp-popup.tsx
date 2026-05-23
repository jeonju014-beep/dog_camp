import type { CampingItem } from "@/types";

export function CampPopupContent({ camp }: { camp: CampingItem }) {
  return (
    <div className="camp-popup min-w-[240px] max-w-[300px] p-1 text-sm text-stone-800">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-bold leading-tight">{camp.name}</h3>
        {camp.isBestSpot && (
          <span className="shrink-0 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
            오늘의 최고 캠핑장
          </span>
        )}
      </div>
      <p className="text-xs text-stone-500">{camp.address}</p>
      <div className="mt-2 rounded-lg bg-amber-50 px-2 py-1.5 text-center">
        <span className="text-xs text-stone-500">추천지수</span>
        <p className="text-xl font-bold text-amber-700">{camp.score}점</p>
      </div>
      <dl className="mt-2 space-y-1 text-xs">
        <div>
          <dt className="font-medium text-stone-600">허용 크기</dt>
          <dd>{camp.allowedSize}</dd>
        </div>
        <div>
          <dt className="font-medium text-stone-600">반려견 시설</dt>
          <dd>{camp.petFacilities.join(", ")}</dd>
        </div>
        <div>
          <dt className="font-medium text-stone-600">주변 환경</dt>
          <dd>{camp.environment}</dd>
        </div>
        <div>
          <dt className="font-medium text-stone-600">5일 날씨</dt>
          <dd className="flex flex-wrap gap-1 pt-0.5">
            {camp.weatherDays.length > 0 ? (
              camp.weatherDays.map((d) => (
                <span
                  key={d.date}
                  className="rounded bg-stone-100 px-1.5 py-0.5"
                  title={d.description}
                >
                  {d.label} {d.tempAvg}°
                </span>
              ))
            ) : (
              <span>
                {camp.todayTemp}° · 강수 {camp.todayPop}%
              </span>
            )}
          </dd>
        </div>
        {camp.tel && (
          <div>
            <dt className="font-medium text-stone-600">전화</dt>
            <dd>
              <a href={`tel:${camp.tel}`} className="text-amber-700 underline">
                {camp.tel}
              </a>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
