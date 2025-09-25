import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

const Testimonial = ({ review }) => {
  return (
    <>
      <div className="woocomerce__testimonial woocomerce-padding">
        <div className="woocomerce__testimonial-wrapper">
          <div className="swiper woocomerce-testimonial">
            <Swiper
              loop={true}
              speed={2000}
              slidesPerView={4}
              spaceBetween={20}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 5,
                },
                480: {
                  slidesPerView: 1,
                  spaceBetween: 30,
                },
                640: {
                  slidesPerView: 1,
                  spaceBetween: 40,
                },
              }}
            >
              {review &&
                review.length &&
                review.map((el) => (
                  <SwiperSlide key={el.id}>
                    <div className="woocomerce__testimonial-item">
                      {/* <div className="woocomerce__testimonial-thumb">
                        <Image
                          width={47}
                          height={37}
                          src="/assets/imgs/woocomerce/products/quote.png"
                          alt="quote"
                        />
                      </div> */}
                      <div className="woocomerce__testimonial-content">
                        <p className="woocomerce__testimonial-dis">{el.text}</p>
                        {/* <h2 className="woocomerce__testimonial-name">
                          {el.name}
                        </h2> */}
                        {/* <span className="woocomerce__testimonial-post">
                          {el.post}
                        </span> */}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
};

export default Testimonial;
