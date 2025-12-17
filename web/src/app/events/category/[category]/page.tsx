// "use client";

// import { EventItem } from "@/types/event";
// import EventCard from "@/components/event-card";
// import { useEffect, useState } from "react";

// const CATEGORIES = [
//   "ENTERTAINMENT",
//   "SPORTS_AND_COMPETITION",
//   "EDUCATION_AND_WORKSHOP",
//   "BUSSINESS_AND_NETWORKING",
//   "ART_AND_CULTURE",
// ];

// export default function EventList() {
//   const [events, setEvents] = useState<EventItem[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [page, setPage] = useState(1);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       const url = `/api/events/category/category?page=${page}&category=${selectedCategory}`;
//       const res = await fetch(url);
//       const result = await res.json();

//       // Mapping data sesuai kebutuhan komponen EventCard
//       const mapped = result.data.map((event: any) => ({
//         id: event.id,
//         name: event.name,
//         imageUrl: event.eventImages?.[0]?.url ?? "/placeholder.jpg",
//       }));

//       setEvents(mapped);
//     };

//     fetchEvents();
//   }, [page, selectedCategory]); // Fetch ulang jika kategori berubah

//   return (
//     <section className="p-6">
//       {/* Tab/Button Category */}
//       <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
//         <button
//           onClick={() => {
//             setSelectedCategory("");
//             setPage(1);
//           }}
//           className={`px-4 py-2 rounded-full border ${
//             selectedCategory === "" ? "bg-blue-500 text-white" : "bg-white"
//           }`}
//         >
//           All
//         </button>
//         {CATEGORIES.map((cat) => (
//           <button
//             key={cat}
//             onClick={() => {
//               setSelectedCategory(cat);
//               setPage(1);
//             }}
//             className={`px-4 py-2 rounded-full border ${
//               selectedCategory === cat ? "bg-blue-500 text-white" : "bg-white"
//             }`}
//           >
//             {cat}
//           </button>
//         ))}
//       </div>

//       {/* Grid Events */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {events.map((event) => (
//           <EventCard key={event.id} event={event} />
//         ))}
//       </div>
//     </section>
//   );
// }
