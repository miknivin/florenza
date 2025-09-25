import Head from "next/head";
import {
  CommonAnimation,
  CursorAnimation,
  ScrollTop,
  Preloader,
  ScrollSmootherComponents,
  Header,
  Hero,
  Feature,
  Banner1,
  Banner2,
  AllWithFilter,
  Category,
  VideoBanner,
  Testimonial,
  Brand,
  Instagram,
  Footer,
} from "@/components";

import useSWR from "swr";
import { useRef } from "react";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Index = () => {
  const cursor1 = useRef();
  const cursor2 = useRef();
  const { data: allProduct, error } = useSWR(
    "assets/json/allProducts.json",
    fetcher
  );
  const { data: allAdd, error2 } = useSWR(
    "assets/json/advertisingData.json",
    fetcher
  );
  const { data: allBrand, error3 } = useSWR(
    "assets/json/allBrands.json",
    fetcher
  );
  const { data: allInstagram, error4 } = useSWR(
    "assets/json/allInstagram.json",
    fetcher
  );
  const { data: allCategories, error5 } = useSWR(
    "assets/json/allCategories.json",
    fetcher
  );
  const { data: allReview, error6 } = useSWR(
    "assets/json/allReview.json",
    fetcher
  );
  if (error || error2 || error3 || error4 || error5 || error6)
    return <div>Failed to load</div>;
  if (
    !allProduct ||
    !allAdd ||
    !allBrand ||
    !allInstagram ||
    !allCategories ||
    !allReview
  )
    return (
      <div>
        <Preloader />
      </div>
    );
  const allData = allProduct.products;
  let allFeatured = [];
  allData.filter((el) => {
    if (el.featured) {
      allFeatured.push(el);
    }
  });
  const featured = allFeatured;
  let allNewProduct = [];
  allData.filter((el) => {
    if (el.new) {
      allNewProduct.push(el);
    }
  });
  const newProduct = allNewProduct;

  const heroAdd = allAdd.hero_advertising;
  // if select section
  let bodyBanner1 = [];
  let bodyBanner2 = [];
  allAdd.body_advertising.map((el) => {
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
  // if(allAdd.body_advertising.length >= 2) {
  //   let bodyBanner1 = allAdd.body_advertising.slice(0, 2)
  //   banner1Add = bodyBanner1;

  // }
  // if(allAdd.body_advertising.length > 3) {
  //   let bodyBanner2 = allAdd.body_advertising.slice(2, 4)
  //   banner2Add = bodyBanner2;
  // }

  const brand = allBrand.brands;
  const instagram = allInstagram.instagram;
  const categories = allCategories.categories;
  const review = allReview.review;
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Home Description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <CommonAnimation>
          <div className="has-smooth" id="has_smooth"></div>
          <ScrollSmootherComponents />
          <CursorAnimation cursor1={cursor1} cursor2={cursor2} />
          {/* <Switcher cursor1={cursor1} cursor2={cursor2} /> */}
          <ScrollTop />
          <div id="smooth-wrapper" className="woocomerce__main"  >
            <div id="smooth-content">
              <Header />
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
              <AllWithFilter allData={allData} />
              {/* <Category categories={categories} /> */}
              <VideoBanner />
              {/* <Testimonial review={review} /> */}
              <Brand brand={brand} />
              <Instagram instagram={instagram} />
              <Footer />
            </div>
          </div>
        </CommonAnimation>
      </main>
    </>
  );
};

export default Index;
