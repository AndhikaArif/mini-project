import Link from "next/link";

import { IoMusicalNotesOutline } from "react-icons/io5";
import { MdOutlineSportsBaseball } from "react-icons/md";
import { HiOutlinePaintBrush } from "react-icons/hi2";
import { LiaBrainSolid } from "react-icons/lia";
import { FaRegChartBar } from "react-icons/fa";

export default function CategorySection() {
  return (
    <section className="flex flex-col justify-center items-center pt-20 gap-y-6">
      <h2 className="self-start text-2xl ml-6 md:ml-50 tracking-wide">
        Events's Category
      </h2>

      <div className="flex justify-evenly items-center w-[450px] mx-auto md:w-[1125px]">
        <Link
          href="/events"
          className="flex flex-col items-center gap-2 md:gap-3 hover:scale-105 duration-300"
        >
          <HiOutlinePaintBrush className="text-5xl border rounded-xl p-2 md:text-6xl" />
          <h2 className="text-sm md:text-lg">Art</h2>
        </Link>

        <Link
          href="/events"
          className="flex flex-col items-center gap-2 md:gap-3 hover:scale-105 duration-300"
        >
          <LiaBrainSolid className="text-5xl border rounded-xl p-2 md:text-6xl" />
          <h2 className="text-sm md:text-lg">Education</h2>
        </Link>

        <Link
          href="/events"
          className="flex flex-col items-center gap-2 md:gap-3 hover:scale-105 duration-300"
        >
          <IoMusicalNotesOutline className="text-5xl border rounded-xl p-2 md:text-6xl" />
          <h2 className="text-sm md:text-lg">Entertainment</h2>
        </Link>

        <Link
          href="/events"
          className="flex flex-col items-center gap-2 md:gap-3 hover:scale-105 duration-300"
        >
          <FaRegChartBar className="text-5xl border rounded-xl p-2 md:text-6xl" />
          <h2 className="text-sm md:text-lg">Bussiness</h2>
        </Link>

        <Link
          href="/events"
          className="flex flex-col items-center gap-2 md:gap-3 hover:scale-105 duration-300"
        >
          <MdOutlineSportsBaseball className="text-5xl border rounded-xl p-2 md:text-6xl" />
          <h2 className="text-sm md:text-lg">Sports</h2>
        </Link>
      </div>
    </section>
  );
}
