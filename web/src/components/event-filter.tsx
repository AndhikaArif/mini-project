"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CATEGORY_OPTIONS, LOCATION_OPTIONS } from "@/services/event.services";
import { RiArrowDropDownLine } from "react-icons/ri";

export default function EventFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentCategory = searchParams.get("category") ?? "";
  const currentLocation = searchParams.get("location") ?? "";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) params.delete(key);
    else params.set(key, value);

    params.set("page", "1");
    router.push(`/events?${params.toString()}`);
    setOpen(false); // optional: close after select
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer flex items-center"
      >
        Filter <RiArrowDropDownLine className="text-3xl" />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-64 rounded-md bg-gray-100 border border-gray-200 shadow-xl p-4 z-20 space-y-4"
        >
          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Category</label>
            <select
              value={currentCategory}
              onChange={(e) => updateParam("category", e.target.value)}
              className="border border-gray-300 bg-gray-200 rounded-md shadow px-2 py-1"
            >
              <option value="">All Categories</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Location</label>
            <select
              value={currentLocation}
              onChange={(e) => updateParam("location", e.target.value)}
              className="border border-gray-300 bg-gray-200 rounded-md shadow px-2 py-1"
            >
              <option value="">All Locations</option>
              {LOCATION_OPTIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
