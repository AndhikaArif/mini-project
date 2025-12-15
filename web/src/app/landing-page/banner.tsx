import Image from "next/image";

export default function BannerSection() {
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
