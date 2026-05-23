import { cn } from "@/lib/utils/cn";

export function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "muted";
}) {
  const styles = {
    default: "bg-brand-100 text-brand-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-800",
    muted: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[variant]
      )}
    >
      {children}
    </span>
  );
}
