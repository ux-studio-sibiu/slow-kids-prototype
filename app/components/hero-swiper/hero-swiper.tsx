"use client";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./hero-swiper.scss";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination, Keyboard, A11y } from "swiper/modules";
import Image, { type StaticImageData } from "next/image";
// Curated hero images from /media/good (bundled by Next, no /public copy).
import good1 from "@/media/good/21d859bf-fd90-4e04-b415-3d2bb2dd8695.jpg";
import good2 from "@/media/good/2583e8ae-9e84-4e16-b2fc-50808c5ee9b2.jpg";
import good3 from "@/media/good/6bbae32a-d7fb-40c3-9119-a496152ca780.jpg";
import good4 from "@/media/good/a-1.png";
import good5 from "@/media/good/a-3.png";
import good6 from "@/media/good/a8cd93f4-d5f5-4e7f-ac5c-4d14cb02e0f7-image_edit_oai_img_rewchsIDZeB_1ftjI12Cm.png";
import good7 from "@/media/good/d2bb9be2-6286-42bf-9bce-773f16ea23d8-image_edit_oai_img_lEzjizsvSVLlWQjmlJ2Vm.png";

export type HeroSwiperImage = { url: string | StaticImageData; lqip?: string };

const LOCAL_IMAGES: HeroSwiperImage[] = [good1, good2, good3, good4, good5, good6, good7].map((img) => ({
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
