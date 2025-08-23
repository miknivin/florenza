import Image from "next/image";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import Circle01 from "../../../public/assets/imgs/woocomerce/circle-1.png";
import HeroPrev from "../../../public/assets/imgs/woocomerce/hero-prev.png";
import HeroRight from "../../../public/assets/imgs/woocomerce/hero-right.png";

const Hero = ({ advertising }) => {
  return (
    <>
      <div className="woocomerce__hero">
        <Image
          priority
          width={315}
          height={630}
          src={Circle01}
          alt="shape"
          className="woocomerce__hero-circle"
        />
        <span className="woocomerce__hero-line line1"></span>
        <span className="woocomerce__hero-line line2"></span>
        <span className="woocomerce__hero-line line3"></span>
        <span className="woocomerce__hero-line line4"></span>
        <div className="woocomerce-active">
          <Swiper
            modules={[Autoplay, EffectFade, Pagination, Navigation]}
            loop={true}
            speed={2000}
            autoplay={{
              delay: 2000,
            }}
            effect={"fade"}
            fadeEffect={true}
            // pagination removed
            navigation={{
              nextEl: ".woocomerce__hero-next",
              prevEl: ".woocomerce__hero-prev",
            }}
          >
            {advertising.map((el) => {
              return (
                <SwiperSlide key={el.id}>
                  <div
                    className="woocomerce__hero-item"
                    style={{
                      backgroundImage: `url(/assets/imgs/${el.img})`,
                    }}
                  >
                    {/* <span className="woocomerce__hero-rectangle"></span>
                    <div className="woocomerce__hero-content">
                      <h1 className="woocomerce__hero-htitle">
                        {el.title.split(" ", 1)} <br />{" "}
                        <span>{el.title.split(" ").slice(1, 3).join(" ")}</span>{" "}
                        <br />{" "}
                        {el.title
                          .split(" ")
                          .splice(3, el.title.split(" ").length - 1)
                          .join(" ")}
                      </h1>
                      <span className="woocomerce__hero-subtitle">
                        {el.sub_title}
                      </span>
                      <strong className="woocomerce__hero-price">
                        ${el.price}
                      </strong>
                      <p className="woocomerce__hero-dis">{el.description}</p>
                    </div> */}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          

          {/* If we need navigation buttons  */}
          <div style={{ cursor: "pointer" }} className="woocomerce__hero-prev">
            <Image
              priority
              width={24}
              style={{ height: "auto" }}
              src={HeroPrev}
              alt="shape"
            />
          </div>
          <div style={{ cursor: "pointer" }} className="woocomerce__hero-next">
            <Image
              priority
              width={24}
              style={{ height: "auto" }}
              src={HeroRight}
              alt="shape"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
