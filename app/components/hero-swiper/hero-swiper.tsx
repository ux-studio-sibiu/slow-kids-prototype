"use client";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./hero-swiper.scss";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination, Keyboard, A11y } from "swiper/modules";
import Image, { type StaticImageData } from "next/image";
import a1 from "@/media/a-1.png";
import a2 from "@/media/a-2.png";
import a3 from "@/media/a-3.png";
import edit1 from "@/media/c92954f2-1d09-4bfa-9b89-d5c7bda49159-image_edit_oai_img_QaJD2uSQWqeYxbCckLhcA.png";

export type HeroSwiperImage = { url: string | StaticImageData; lqip?: string };

const LOCAL_IMAGES: HeroSwiperImage[] = [a1, a2, a3, edit1].map((img) => ({
  url: img,
  lqip: img.blurDataURL,
}));

export default function HeroSwiper() {
  return (
    <Swiper
      className="nsc-hero-swiper"
      modules={[EffectFade, Navigation, Pagination, Keyboard, A11y]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      loop
      slidesPerView={1}
      keyboard={{ enabled: true }}
      navigation
      pagination={{ clickable: true }}
    >
      {LOCAL_IMAGES.map((src, idx) => (
        <SwiperSlide key={idx}>
          <Image src={src.url} className="object-cover" alt={`Image ${idx + 1}`} fill priority={idx === 0} sizes="100vw" placeholder={src.lqip ? "blur" : "empty"} blurDataURL={src.lqip} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
