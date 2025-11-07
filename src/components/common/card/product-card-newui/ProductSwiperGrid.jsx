"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import { useGetProductsQuery } from "@/store/api/productApi";
import ProductCardNewUi from "./ProductCardNewUi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import ArrowIcon from "@/components/icons/ArrowIcon";

const ProductSwiperGrid = ({ initialPage = 1, isProductPage = false }) => {
  const perPage = 14;
  const { data, isLoading, error } = useGetProductsQuery({
    page: initialPage,
    resPerPage: perPage,
  });

  const nonComboProducts = React.useMemo(() => {
    const all = data?.filteredProducts || [];
    return all.filter((p) => p.category !== "Combo");
  }, [data?.filteredProducts]);

  const firstFive = nonComboProducts.slice(0, 5);
  const remainingSix = nonComboProducts.slice(5);

  const [swiper1, setSwiper1] = useState({ isBeginning: true, isEnd: false });
  const [swiper2, setSwiper2] = useState({ isBeginning: true, isEnd: false });

  if (error) {
    return <div className="text-center py-5">Failed to load products.</div>;
  }

  return (
    <div className={`${isProductPage ? "py-1" : "py-5"} woocomerce-padding`}>
      {/* ---------- Header ---------- */}
      {!isProductPage && (
        <>
          <div className="">
            <div className="woocomerce__feature-top d-flex justify-content-between">
              <p className="woocomerce__feature-title font-roboto">
                Our products
              </p>
              <Link
                className="text-white font-roboto d-flex align-items-center"
                href="/shop/full"
              >
                View all
                <ArrowIcon />
              </Link>
            </div>
          </div>
          <hr
            style={{ borderTop: "1px solid #fff", opacity: 0.7 }}
            className="border-top-white"
          />
        </>
      )}

      {/* ---------- FIRST SWIPER ---------- */}
      <div className="mb-8 ps-2 mt-md-5">
        <div className="wrap-carousel position-relative">
          <div
            className={`
              carousal-end carousal-1
              ${isProductPage ? "product-page" : ""}
              ${swiper1.isBeginning ? "hide-before" : ""}
              ${swiper1.isEnd ? "hide-after" : ""}
            `
              .trim()
              .replace(/\s+/g, " ")}
          >
            <Swiper
              dir="ltr"
              slidesPerView={2.3}
              spaceBetween={8}
              modules={[Navigation, Pagination, FreeMode]}
              freeMode={{
                enabled: true,
                momentum: true,
                sticky: false,
                momentumBounce: false,
              }}
              navigation={{
                prevEl: ".snbp3-1",
                nextEl: ".snbn3-1",
              }}
              pagination={{ clickable: true, el: ".spb3-1" }}
              breakpoints={{
                0: { slidesPerView: 2.2, spaceBetween: 6 },
                640: { slidesPerView: 3.2, spaceBetween: 12 },
                768: { slidesPerView: 3.5, spaceBetween: 16 },
                1024: { slidesPerView: 4.5, spaceBetween: 18 },
              }}
              className="product-swiper w-100"
              onSwiper={(s) => setSwiper1({ isBeginning: true, isEnd: false })}
              onReachBeginning={() =>
                setSwiper1((p) => ({ ...p, isBeginning: true }))
              }
              onReachEnd={() => setSwiper1((p) => ({ ...p, isEnd: true }))}
              onFromEdge={() =>
                setSwiper1({ isBeginning: false, isEnd: false })
              }
            >
              {firstFive.map((product) => (
                <SwiperSlide key={product._id}>
                  <div className="d-flex justify-content-center">
                    <ProductCardNewUi product={product} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="nav-sw nav-next-slider nav-next-testimonial lg snbp3-1">
            <span className="icon icon-arrow-left" />
          </div>
          <div className="nav-sw nav-prev-slider nav-prev-testimonial lg snbn3-1">
            <span className="icon icon-arrow-right" />
          </div>
          <div className="sw-dots style-2 sw-pagination-testimonial justify-content-center spb3-1 hidden-pagination" />
        </div>
      </div>

      {/* ---------- SECOND SWIPER ---------- */}
      <div className="ps-2">
        <div className="wrap-carousel position-relative mt-5">
          <div
            className={`
              carousal-end carousal-2
              ${isProductPage ? "product-page" : ""}
              ${swiper2.isBeginning ? "hide-before" : ""}
              ${swiper2.isEnd ? "hide-after" : ""}
            `
              .trim()
              .replace(/\s+/g, " ")}
          >
            <Swiper
              dir="ltr"
              slidesPerView={2.3}
              spaceBetween={8}
              modules={[Navigation, Pagination, FreeMode]}
              freeMode={{
                enabled: true,
                momentum: true,
                sticky: false,
                momentumBounce: false,
              }}
              navigation={{
                prevEl: ".snbp3-2",
                nextEl: ".snbn3-2",
              }}
              pagination={{ clickable: true, el: ".spb3-2" }}
              breakpoints={{
                0: { slidesPerView: 2.2, spaceBetween: 6 },
                640: { slidesPerView: 3.2, spaceBetween: 10 },
                768: { slidesPerView: 3.5, spaceBetween: 16 },
                1024: { slidesPerView: 4.5, spaceBetween: 18 },
              }}
              className="product-swiper w-100"
              onSwiper={(s) => setSwiper2({ isBeginning: true, isEnd: false })}
              onReachBeginning={() =>
                setSwiper2((p) => ({ ...p, isBeginning: true }))
              }
              onReachEnd={() => setSwiper2((p) => ({ ...p, isEnd: true }))}
              onFromEdge={() =>
                setSwiper2({ isBeginning: false, isEnd: false })
              }
            >
              {remainingSix.map((product) => (
                <SwiperSlide key={product._id}>
                  <div className="d-flex justify-content-center">
                    <ProductCardNewUi product={product} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="nav-sw nav-next-slider nav-next-testimonial lg snbp3-2">
            <span className="icon icon-arrow-left" />
          </div>
          <div className="nav-sw nav-prev-slider nav-prev-testimonial lg snbn3-2">
            <span className="icon icon-arrow-right" />
          </div>
          <div className="sw-dots style-2 sw-pagination-testimonial justify-content-center spb3-2 hidden-pagination" />
        </div>
      </div>

      {/* ---------- Loading ---------- */}
      {isLoading && (
        <div className="text-center py-3">
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSwiperGrid;
