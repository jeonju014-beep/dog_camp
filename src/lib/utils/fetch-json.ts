export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const text = await res.text();
  if (!text.trim()) {
    throw new Error(`Empty response (${res.status}) from ${url}`);
  }
  let data: T;
  try {
    data = JSON.parse(text) as T;
  } catch {
    throw new Error(`Invalid JSON (${res.status}): ${text.slice(0, 120)}`);
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return data;
}
