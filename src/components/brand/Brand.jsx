import Image from "next/image";
import { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

const Brand = ({ brand }) => {
  return (
    <>
      <div className="woocomerce__brand woocomerce-padding">
        {/* <div className="woocomerce__brand-wrapper">
          <div className="swiper woocomerce-brand-active">
            <Swiper
              modules={[Autoplay]}
              speed={6000}
              loop={true}
              autoplay={{
                delay: 0,
              }}
              allowTouchMove={false}
              slidesPerView={9}
              spaceBetween={5}
              breakpoints={{
                320: {
                  slidesPerView: 2,
                  spaceBetween: 5,
                },
                700: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                1000: {
                  slidesPerView: 5,
                  spaceBetween: 40,
                },
              }}
            >
              {brand &&
                brand.length &&
                brand.map((el) => (
                  <SwiperSlide key={el.id}>
                    <div className="woocomerce__brand-item hover_image">
                      <Image
                        priority={true}
                        width={95}
                        height={44}
                        style={{ height: "auto" }}
                        src={`/assets/imgs/${el.logo}`}
                        alt="brand"
                      />
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Brand;
