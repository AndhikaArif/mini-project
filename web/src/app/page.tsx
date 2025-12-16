"use client";
import BannerSection from "./landing-page/banner";
import TopThreeEvent from "./landing-page/top-three-event";
import CategorySection from "./landing-page/category";
import EventsSection from "./landing-page/events";

export default function DashboardPage() {
  return (
    <main className="min-h-auto pb-30">
      <BannerSection />
      <TopThreeEvent />
      <CategorySection />
      <EventsSection />
    </main>
  );
}
