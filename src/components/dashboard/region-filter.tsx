"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import type { RegionCode } from "@/types";

const OPTIONS: { value: RegionCode; label: string }[] = [
  { value: "all", label: "전체 비교" },
  { value: "37", label: "전라북도" },
  { value: "38", label: "전라남도" },
];

export function RegionFilter() {
  const searchParams = useSearchParams();
  const current = (searchParams.get("region") ?? "all") as RegionCode;

  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((opt) => {
        const href =
          opt.value === "all" ? "/" : `/?region=${opt.value}`;
        const active = current === opt.value;

        return (
          <Link
            key={opt.value}
            href={href}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-amber-500 text-white shadow-sm"
                : "bg-white text-stone-600 ring-1 ring-amber-200 hover:bg-amber-50"
            )}
          >
            {opt.label}
          </Link>
        );
      })}
    </div>
  );
}
