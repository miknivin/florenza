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
import ContactCard from "@/components/footer/FooterNewUi/ContactCard";
import FooterLinks from "@/components/footer/FooterNewUi/FooterLinks";

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
            <ContactCard />
          </div>
        </div>
      </CommonAnimation>
    </>
  );
};

export default ProductLayout;
