import Link from "next/link";
import Image from "next/image";
import ProductSwiper from "../common/ProductSwiper";

const Feature = ({ featured, headerTitle, routeName }) => {
  return (
    <>
      <div className="woocomerce__feature woocomerce-padding wc_feature_products" >
        <div className="woocomerce__feature-top">
          <p className="woocomerce__feature-title">{headerTitle}</p>
          <div className="woocomerce__feature-rightwrapper">
            <div className="woocomerce__feature-arrowwrapper">
              <div className="swiper-button-narrow pointer_cursor">
                <Image
                  width={7}
                  height={12}
                  style={{ width: "auto", height: "auto" }}
                  src="/assets/imgs/woocomerce/arrow-left.png"
                  alt="prev"
                />
              </div>
              <div className="swiper-button-parrow pointer_cursor">
                <Image
                  width={7}
                  height={12}
                  style={{ width: "auto", height: "auto" }}
                  src="/assets/imgs/woocomerce/arrow-right.png"
                  alt="prev"
                />
              </div>
            </div>
            <Link
              className="woocomerce__feature-viewall"
              href={`/feature/${routeName}`}
            >
              View all
            </Link>
          </div>
        </div>

        <div className="woocomerce__feature1-wrapper">
          <div className="swiper feature1-active">
            <ProductSwiper featured={featured} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Feature;
