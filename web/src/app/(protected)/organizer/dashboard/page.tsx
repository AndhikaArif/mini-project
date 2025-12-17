"use client";

import { useAuth } from "@/context/auth-context";
import DashboardStats from "@/components/organizer/dashboard-stats";
import OrganizerEvents from "@/components/organizer/organizer-events";
import OrganizerTransactions from "@/components/organizer/organizer-transactions";
import Forbidden from "@/components/error/forbidden";
import Unauthorized from "@/components/error/unauthorized";

export default function OrganizerDashboardPage() {
  const { user, loading } = useAuth();

  // tunggu auth selesai
  if (loading) return null;

  // belum login
  if (!user) {
    return <Unauthorized />;
  }

  // login tapi bukan organizer
  if (user.role !== "EVENT_ORGANIZER") {
    return <Forbidden />;
  }

  // organizer valid
  return (
    <main className="p-6 space-y-6">
      <DashboardStats />
      <OrganizerEvents />
      <OrganizerTransactions />
    </main>
  );
}
