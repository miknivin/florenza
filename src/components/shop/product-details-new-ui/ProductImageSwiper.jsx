// app/shop/[id]/ProductImageSwiper.js
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

/**
 * Props:
 *   images: Array<{ url: string, alt?: string }>  – dynamic product images
 *   fallbackImages: (optional) static test images – used when no images passed
 */
export default function ProductImageSwiper({
  images = [],
  fallbackImages = [
    {
      url: "https://ik.imagekit.io/c1jhxlxiy/Untitled%20design%20(16).png?updatedAt=1762345500452",
      alt: "Test Product Image 1",
    },
    {
      url: "https://ik.imagekit.io/c1jhxlxiy/Untitled%20design%20(15).png?updatedAt=1762345500490",
      alt: "Test Product Image 2",
    },
  ],
}) {
  // Use dynamic images if provided, otherwise fall back to static test images
  const displayImages = images.length > 0 ? images : fallbackImages;

  return (
    <div className="mb-4 position-relative">
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true, el: ".custom-pagination" }}
        spaceBetween={10}
        slidesPerView={1} // 1 image per view on every breakpoint
        loop={displayImages.length > 1}
        className="product-swiper"
      >
        {displayImages.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="ratio ratio-1x1">
              <Image
                src={img.url}
                alt={img.alt || `Product image ${i + 1}`}
                fill
                className="object-fit-cover"
                priority={i === 0}
                onError={(e) => {
                  e.currentTarget.src = "/assets/imgs/placeholder.jpg";
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination Dots */}
      <div className="custom-pagination d-flex justify-content-center" />
    </div>
  );
}
