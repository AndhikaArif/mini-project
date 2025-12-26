"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function EventSort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sortBy") ?? "";

  const updateSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) params.delete("sortBy");
    else params.set("sortBy", value);

    params.set("page", "1");
    router.push(`/events?${params.toString()}`);
  };

  return (
    <select
      value={currentSort}
      onChange={(e) => updateSort(e.target.value)}
      className="cursor-pointer"
    >
      <option value="" disabled hidden>
        Sort By
      </option>
      <option value="default">Default</option>
      <option value="newest">Newest</option>
      <option value="latest">Oldest</option>
    </select>
  );
}
