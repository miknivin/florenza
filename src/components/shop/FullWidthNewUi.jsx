// src/components/shop/FullWidthNewUi.jsx
import ComboSwiper from "../common/card/product-card-newui/combo/ComboSwiper";
import ProductSwiperGrid from "../common/card/product-card-newui/ProductSwiperGrid";

const FullWidthNewUi = () => {
  return (
    <>
      <div className="woocomerce__filtering woocomerce-padding px-0 pt-4 pb-4">
        <div className="woocomerce__shopinner wc_feature_products">
          <ProductSwiperGrid isProductPage={true} />
          <ComboSwiper/>
        </div>
      </div>
    </>
  );
};

export default FullWidthNewUi;
