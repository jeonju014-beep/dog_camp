import { Cloud, CloudRain, Thermometer } from "lucide-react";
import type { TodayWeather } from "@/types";

export function TodayWeatherCard({ weather }: { weather: TodayWeather }) {
  return (
    <div className="rounded-2xl border border-amber-200/80 bg-white/95 px-5 py-4 shadow-lg backdrop-blur">
      <p className="text-xs font-medium uppercase tracking-wide text-amber-800/80">
        오늘 · {weather.label}
      </p>
      <div className="mt-3 grid grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-amber-600" />
          <div>
            <p className="text-xs text-stone-500">기온</p>
            <p className="text-lg font-bold text-stone-800">{weather.temp}°C</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CloudRain className="h-5 w-5 text-sky-600" />
          <div>
            <p className="text-xs text-stone-500">강수</p>
            <p className="text-lg font-bold text-stone-800">
              {weather.rainMm}mm
            </p>
            <p className="text-[10px] text-stone-400">{weather.pop}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-stone-500" />
          <div>
            <p className="text-xs text-stone-500">구름</p>
            <p className="text-lg font-bold text-stone-800">{weather.clouds}%</p>
            <p className="text-[10px] text-stone-400 line-clamp-1">
              {weather.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
