import type { RegionId } from "@/types";

export function isJeollaAddress(addr: string, doNm?: string): boolean {
  const text = `${addr} ${doNm ?? ""}`;
  return /전라북|전라남|전북특별|전남특별|전북|전남/.test(text);
}

export function regionFromAddress(addr: string, doNm?: string): RegionId | null {
  const text = `${addr} ${doNm ?? ""}`;
  if (/전라남|전남특별|전남/.test(text)) return "jeonnam";
  if (/전라북|전북특별|전북/.test(text)) return "jeonbuk";
  return null;
}
