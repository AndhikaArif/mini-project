"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import StatCard from "./stat-card";

type DashboardStats = {
  totalEvents: number;
  totalOrders: number;
  totalTicketsSold: number;
  totalRevenue: number;
};

export default function DashboardStats({ refreshKey }: { refreshKey: number }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/organizer/dashboard/stats`,
          { withCredentials: true }
        );

        setStats(res.data.summary);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [refreshKey]);

  if (loading) return <p>Loading stats...</p>;
  if (!stats) return <p>Failed to load stats</p>;

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard title="Total Events" value={stats.totalEvents} />
      <StatCard title="Orders" value={stats.totalOrders} />
      <StatCard title="Tickets Sold" value={stats.totalTicketsSold} />
      <StatCard
        title="Revenue"
        value={`Rp ${stats.totalRevenue.toLocaleString("id-ID")}`}
      />
    </section>
  );
}
