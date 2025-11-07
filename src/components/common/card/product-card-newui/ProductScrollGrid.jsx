"use client";
import React, { useRef, useEffect } from "react";
import { useGetProductsQuery } from "@/store/api/productApi";
import ProductCardNewUi from "./ProductCardNewUi";

const ProductScrollGrid = ({ initialPage = 1 }) => {
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

  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);

  const enableDragScroll = (ref) => {
    if (!ref.current) return;

    const el = ref.current;
    let isDown = false;
    let startX;
    let scrollLeft;

    const handleStart = (e) => {
      isDown = true;
      el.classList.add("active");
      startX = e.pageX || e.touches[0].pageX;
      scrollLeft = el.scrollLeft;
    };

    const handleEnd = () => {
      isDown = false;
      el.classList.remove("active");
    };

    const handleMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX || e.touches[0].pageX;
      const walk = (x - startX) * 2; // Scroll speed
      el.scrollLeft = scrollLeft - walk;
    };

    // Mouse
    el.addEventListener("mousedown", handleStart);
    el.addEventListener("mouseleave", handleEnd);
    el.addEventListener("mouseup", handleEnd);
    el.addEventListener("mousemove", handleMove);

    // Touch
    el.addEventListener("touchstart", handleStart);
    el.addEventListener("touchend", handleEnd);
    el.addEventListener("touchmove", handleMove);

    // Prevent context menu on long press
    el.addEventListener("contextmenu", (e) => e.preventDefault());

    return () => {
      el.removeEventListener("mousedown", handleStart);
      el.removeEventListener("mouseleave", handleEnd);
      el.removeEventListener("mouseup", handleEnd);
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("touchstart", handleStart);
      el.removeEventListener("touchend", handleEnd);
      el.removeEventListener("touchmove", handleMove);
      el.removeEventListener("contextmenu", (e) => e.preventDefault());
    };
  };

  useEffect(() => {
    const cleanup1 = enableDragScroll(scrollRef1);
    const cleanup2 = enableDragScroll(scrollRef2);
    return () => {
      cleanup1?.();
      cleanup2?.();
    };
  }, [firstFive, remainingSix]);

  if (error) {
    return <div className="text-center py-5">Failed to load products.</div>;
  }

  return (
    <div className="py-5">
      <div className="woocomerce-padding">
        <div className="woocomerce__feature-top">
          <p className="woocomerce__feature-title">
            Our products (excluding Combo)
          </p>
        </div>
      </div>

      {/* FIRST ROW */}
      <div className="mb-8 px-2">
        <div ref={scrollRef1} className="horizontal-scroll">
          {firstFive.map((product) => (
            <div key={product._id} className="scroll-item">
              <ProductCardNewUi product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* SECOND ROW */}
      <div className="px-2">
        <div ref={scrollRef2} className="horizontal-scroll">
          {remainingSix.map((product) => (
            <div key={product._id} className="scroll-item">
              <ProductCardNewUi product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Loading */}
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

export default ProductScrollGrid;
