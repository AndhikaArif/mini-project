"use client";

import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";

export default function BannerSection() {
  // const [bannerUrl, setBannerUrl] = useState(null);

  // useEffect(() => {
  //   if (!eventId) return;

  //   const fetchBanner = async () => {
  //     try {
  //       const res = await axios.get(
  //         `http://localhost:8000/api/events/${eventId}`
  //       );
  //       setBannerUrl(res.data.eventImage);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchBanner();
  // }, [eventId]);

  return (
    <section className="flex flex-col items-center justify-center pt-10">
      <div className="relative w-[450px] h-[150px] md:w-[1125px] md:h-[250px]">
        <Image
          src="/dummy-banner.jpg"
          alt="Dummy banner"
          fill
          className="object-cover rounded-2xl"
        />
      </div>
    </section>
  );
}
