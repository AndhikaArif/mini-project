"use client";
import BannerSection from "./landing-page/banner";
import CategorySection from "./landing-page/category";

export default function DashboardPage() {
  return (
    <main className="min-h-screen">
      <BannerSection />
      <CategorySection />
    </main>
  );
}
