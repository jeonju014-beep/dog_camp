import { Inbox } from "lucide-react";

export function EmptyState({
  title = "데이터가 없습니다",
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-3 rounded-full bg-slate-100 p-3">
        <Inbox className="h-6 w-6 text-slate-400" />
      </div>
      <p className="text-sm font-medium text-slate-700">{title}</p>
      {description && (
        <p className="mt-1 max-w-xs text-xs text-slate-500">{description}</p>
      )}
    </div>
  );
}
