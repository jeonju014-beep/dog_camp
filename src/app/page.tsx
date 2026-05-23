import { Suspense } from "react";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import Loading from "./loading";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <Suspense fallback={<Loading />}>
      <DashboardClient />
    </Suspense>
  );
}
