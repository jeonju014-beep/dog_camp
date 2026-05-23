"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FAF7F2]">
      <p className="text-stone-700">페이지를 불러오지 못했습니다.</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-amber-500 px-4 py-2 text-sm text-white"
      >
        다시 시도
      </button>
    </div>
  );
}
