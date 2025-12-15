"use client";
import BannerSection from "./landing-page/banner";
import CategorySection from "./landing-page/category";
import TopThreeEvent from "./landing-page/top-three-event";
import topThreeEvent from "./landing-page/top-three-event";

export default function DashboardPage() {
  return (
    <main className="min-h-screen">
      <BannerSection />
      <TopThreeEvent />
      <CategorySection />
    </main>
  );
}
