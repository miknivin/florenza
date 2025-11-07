import Image from "next/image";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import Circle01 from "../../../public/assets/imgs/woocomerce/circle-1.png";
import HeroPrev from "../../../public/assets/imgs/woocomerce/hero-prev.png";
import HeroRight from "../../../public/assets/imgs/woocomerce/hero-right.png";
import HeaderSearchNewUi from "../search/HeaderSearchNewUi";

const Hero = ({ advertising }) => {
  return (
    <>
      <div className="d-block"></div>
      <div style={{ zIndex: 9 }} className="woocomerce__hero">
        <div className="d-block d-md-none font-roboto">
          <HeaderSearchNewUi />
        </div>

        <Image
          priority
          width={315}
          height={630}
          src={Circle01}
          alt="shape"
          className="woocomerce__hero-circle"
        />
        {/* <span className="woocomerce__hero-line line1"></span>
        <span className="woocomerce__hero-line line2"></span>
        <span className="woocomerce__hero-line line3"></span>
        <span className="woocomerce__hero-line line4"></span> */}
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
            style={{ position: "relative" }}
            // pagination removed
            navigation={{
              nextEl: ".woocomerce__hero-next",
              prevEl: ".woocomerce__hero-prev",
            }}
          >
            {advertising.map((el) => {
              return (
                <SwiperSlide key={el.id}>
                  <div className="woocomerce__hero-item">
                    <Image
                      src={`/assets/imgs/${el.img}`}
                      alt={el.title || "Hero Image"}
                      width={1200}
                      height={600}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                      }}
                      priority
                    />
                  </div>
                </SwiperSlide>
              );
            })}
            <div
              style={{ width: "100vw" }}
              className="position-absolute bottom-0 w-100"
            >
              <img
                style={{ width: "100%" }}
                src="assets/imgs/hero/shadow.png"
              />
            </div>
          </Swiper>

          {/* If we need navigation buttons  */}
          {/* <div style={{ cursor: "pointer" }} className="woocomerce__hero-prev">
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
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Hero;
