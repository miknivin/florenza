import CategoryCard from "./card/CategoryCard";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

const CategorySwiper = ({ categories }) => {
  return (
    <>
      <div className="swiper category-active">
        <Swiper
          modules={[Navigation]}
          speed={2000}
          slidesPerView={9}
          spaceBetween={5}
          navigation={{
            nextEl: ".swiper-button-parrow",
            prevEl: ".swiper-button-narrow",
          }}
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            480: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            640: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            900: {
              slidesPerView: 6,
              spaceBetween: 20,
            },
            1200: {
              slidesPerView: 8,
              spaceBetween: 20,
            },
          }}
        >
          {categories &&
            categories.length &&
            categories.map((el) => (
              <SwiperSlide key={el.id}>
                <CategoryCard el={el} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </>
  );
};

export default CategorySwiper;
