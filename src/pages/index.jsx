import Head from "next/head";
import {
  CommonAnimation,
  CursorAnimation,
  ScrollTop,
  Preloader,
  // ScrollSmootherComponents,
  Header,
  Hero,
  // Feature,
  Banner1,
  Banner2,
  // AllWithFilter,
  // Category,
  VideoBanner,
  // Testimonial,
  // Brand,        // ← Kept imported but commented if you want to re-enable later
  Instagram,
  HeaderTransparent,
  // Footer,
} from "@/components";
import FooterLinks from "@/components/footer/FooterNewUi/FooterLinks";
import ContactCard from "@/components/footer/FooterNewUi/ContactCard";
import ProductSwiperGrid from "@/components/common/card/product-card-newui/ProductSwiperGrid";

import { useRef } from "react";

// Hardcoded advertising data — no fetch needed anymore
const advertisingData = {
  hero_advertising: [
    // {
    //   id: "101",
    //   title: "Express your natural beauty",
    //   description:
    //     "View the full case study of our recent featured and awesome global branding agency that powers",
    //   sub_title: "Starts from",
    //   img: "woocomerce/exclusive/img1.webp",
    //   price: "65.89",
    // },
    // {
    //   id: "103",
    //   title: "Express your natural beauty",
    //   description:
    //     "View the full case study of our recent featured and awesome global branding agency that powers",
    //   sub_title: "Starts from",
    //   img: "woocomerce/exclusive/img2.webp",
    //   price: "65.89",
    // },
    // {
    //   id: "102",
    //   title: "Express your natural beauty",
    //   description:
    //     "View the full case study of our recent featured and awesome global branding agency that powers",
    //   sub_title: "Starts from",
    //   img: "woocomerce/exclusive/img3.webp",
    //   price: "65.89",
    // },
    {
      id: "104",
      title: "Express your natural beauty",
      description:
        "View the full case study of our recent featured and awesome global branding agency that powers",
      sub_title: "Starts from",
      img: "woocomerce/exclusive/img7.webp",
      price: "65.89",
    },
    {
      id: "105",
      title: "Express your natural beauty",
      description:
        "View the full case study of our recent featured and awesome global branding agency that powers",
      sub_title: "Starts from",
      img: "woocomerce/exclusive/img8.webp",
      price: "65.89",
    },
    {
      id: "105",
      title: "Express your natural beauty",
      description:
        "View the full case study of our recent featured and awesome global branding agency that powers",
      sub_title: "Starts from",
      img: "woocomerce/exclusive/img9.webp",
      price: "65.89",
    },
  ],
  body_advertising: [
    {
      id: "401",
      title: "Secret Combo",
      sub_title: "Exclusive",
      section: "1",
      link: "68cbcf6e3fde9bb106ceeaae",
      img: "woocomerce/exclusive/img4.jpeg",
    },
    {
      id: "402",
      title: "Blooms Combo",
      sub_title: "Exclusive",
      section: "1",
      link: "68cbd9783fde9bb106ceec57",
      img: "woocomerce/exclusive/img5.jpeg",
    },
    {
      id: "403",
      title: "Cool Combo",
      sub_title: "Exclusive",
      section: "2",
      img: "woocomerce/exclusive/img4.webp",
    },
    {
      id: "404",
      title: "Exclusive brand Collection",
      sub_title: "Exclusive",
      section: "2",
      img: "woocomerce/exclusive/ex4.jpg",
    },
  ],
};

const Index = () => {
  const cursor1 = useRef();
  const cursor2 = useRef();

  // No SWR for advertisingData — it's static now
  // Only Instagram fetches its own data independently

  // Extract required data (same logic as before)
  const heroAdd = advertisingData.hero_advertising;

  // if select section
  let bodyBanner1 = [];
  let bodyBanner2 = [];
  advertisingData.body_advertising.map((el) => {
    if (el.section == "1") {
      bodyBanner1.push(el);
    } else if (el.section == "2") {
      bodyBanner2.push(el);
    }
  });
  const banner1Add = bodyBanner1;
  const banner2Add = bodyBanner2;

  // if select serially
  // let banner1Add
  // let banner2Add
  // if(advertisingData.body_advertising.length >= 2) {
  // let bodyBanner1 = advertisingData.body_advertising.slice(0, 2)
  // banner1Add = bodyBanner1;
  // }
  // if(advertisingData.body_advertising.length > 3) {
  // let bodyBanner2 = advertisingData.body_advertising.slice(2, 4)
  // banner2Add = bodyBanner2;
  // }

  return (
    <>
      <Head>
        <title>Florenza Italiya</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        <CommonAnimation>
          <div className="has-smooth" id="has_smooth"></div>

          {/* <ScrollSmootherComponents /> */}
          <CursorAnimation cursor1={cursor1} cursor2={cursor2} />
          {/* <Switcher cursor1={cursor1} cursor2={cursor2} /> */}
          <ScrollTop />

          <div id="smooth-wrapper" className="woocomerce__main">
            <div id="smooth-content">
              <Header option="transparent-dark" />
              <Hero advertising={heroAdd} />

              {/* <Feature
                featured={featured}
                headerTitle={"(a) Featured"}
                routeName="featured"
              /> */}
              <div className="my-5"></div>
              <Banner1 banner={banner1Add} />
              <div className="my-3"></div>

              {/* <Feature
                featured={newProduct}
                headerTitle={"(b) New Arrival"}
                routeName="new"
              /> */}
              <Banner2 banner={banner2Add} />
              <ProductSwiperGrid />

              {/* <AllWithFilter allData={allData} /> */}
              {/* <Category categories={categories} /> */}
              <VideoBanner />
              {/* <Testimonial review={review} /> */}
              {/* <Brand brand={brand} /> */}
              <Instagram />
              <FooterLinks />
              <ContactCard />
              {/* <Footer /> */}
            </div>
          </div>
        </CommonAnimation>
      </main>
    </>
  );
};

export default Index;
