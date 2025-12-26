"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import DashboardStats from "@/components/organizer/dashboard-stats";
import OrganizerEvents from "@/components/organizer/organizer-events";
import OrganizerTransactions from "@/components/organizer/organizer-transactions";
import Forbidden from "@/components/error/forbidden";
import Unauthorized from "@/components/error/unauthorized";

export default function OrganizerDashboardPage() {
  const { user, loading } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  if (loading) return null;
  if (!user) return <Unauthorized />;
  if (user.role !== "EVENT_ORGANIZER") return <Forbidden />;

  return (
    <main className="p-6 space-y-6">
      <DashboardStats refreshKey={refreshKey} />
      <OrganizerEvents refreshKey={refreshKey} />
      <OrganizerTransactions
        onPaymentUpdated={() => setRefreshKey((k) => k + 1)}
      />
    </main>
  );
}
