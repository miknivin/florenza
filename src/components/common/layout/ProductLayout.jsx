"use client";
import {
  CommonAnimation,
  CursorAnimation,
  Switcher,
  ScrollTop,
  ScrollSmootherComponents,
  Header,
  Footer,
} from "@/components";

const ProductLayout = ({ children }) => {
  return (
    <>
      <CommonAnimation>
        <div className="has-smooth" id="has_smooth"></div>
        {/* <ScrollSmootherComponents /> */}
        <CursorAnimation />
        <ScrollTop />

        <div id="smooth-wrapper">
          <div id="smooth-content">
            <Header option={"black"} />
            {children}
            <Footer />
          </div>
        </div>
      </CommonAnimation>
    </>
  );
};

export default ProductLayout;
