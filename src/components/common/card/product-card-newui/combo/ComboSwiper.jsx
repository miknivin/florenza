// components/ComboSwiper.js
"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useGetProductsQuery } from "@/store/api/productApi";
import ComboSlide from "./ComboSlide";

export default function ComboSwiper() {
  const { data, isLoading, error } = useGetProductsQuery({
    page: 1,
    resPerPage: 20,
    category: "Combo",
  });

  const combos = (data?.filteredProducts || []).filter(
    (p) => p.category === "Combo"
  );

  if (isLoading) {
    return (
      <section className="py-5">
        <div className="container text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading combos…</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-5">
        <div className="container text-center text-danger">
          Failed to load combos.
        </div>
      </section>
    );
  }

  if (combos.length === 0) return null;

  const slides = combos.map((c) => {
    const mainImage = c.mainImage || null;
    return {
      subtitle: "Exclusive",
      title: c.name,
      description: c.shortDescription || "Premium combo set",
      buttonText: "View",
      buttonLink: `/shop/${c._id}`,
      bgColor: c?.color?.primaryColor || "#7DC6ED",
      imageUrl:
        mainImage ||
        "https://ik.imagekit.io/c1jhxlxiy/Group%20136.png?updatedAt=1762322667109",
    };
  });

  return (
    <section className="py-5">
      <div>
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: true }}
          loop={slides.length > 1}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{
            el: ".custom-pagination-combo",
            clickable: true,
            renderBullet: (index, className) => {
              return `<span class="${className} custom-bullet-combo"></span>`;
            },
          }}
          className="combo-swiper"
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={slide.title + idx}>
              <ComboSlide {...slide} />
            </SwiperSlide>
          ))}
          <div className="custom-pagination-combo d-flex justify-content-center align-items-center mt-4 gap-1" />
        </Swiper>

        {/* Custom Pagination */}
      </div>
    </section>
  );
}
