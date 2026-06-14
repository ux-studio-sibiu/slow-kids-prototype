import HeroSwiper from "@/app/components/hero-swiper/hero-swiper";

// Fallback for unmatched slots (e.g. hard navigation): the hero swiper.
export default function AsideDefault() {
  return (
    <div className="site-hero">
      <HeroSwiper />
    </div>
  );
}
