"use client";
import { useRef, useState, useEffect } from "react";

export default function PriceFilter2({
  allPrice,
  setOpenMobile,
  dispatch,
  initialMin,
  initialMax,
}) {
  // Use the first price range as default or set to reasonable values
  const minPrice = allPrice[0]?.[0] || 0;
  const maxPrice = allPrice[allPrice.length - 1]?.[1] || 10000;
  const [rangeValue1, setRangeValue1] = useState(
    initialMin !== null ? initialMin : minPrice
  );
  const [rangeValue2, setRangeValue2] = useState(
    initialMax !== null ? initialMax : maxPrice
  );
  const progressSlide = useRef(null);

  const updateProgress = () => {
    const minValue = parseInt(rangeValue1);
    const maxValue = parseInt(rangeValue2);
    if (progressSlide.current) {
      progressSlide.current.style.left =
        ((minValue - minPrice) / (maxPrice - minPrice)) * 100 + "%";
      progressSlide.current.style.right =
        ((maxPrice - maxValue) / (maxPrice - minPrice)) * 100 + "%";
    }
  };

  const handleChange = (e, isMin) => {
    const value = parseInt(e.target.value);
    const minValue = parseInt(rangeValue1);
    const maxValue = parseInt(rangeValue2);
    const minGap = 100; // Minimum gap between sliders

    if (isMin) {
      if (value <= maxValue - minGap) {
        setRangeValue1(value);
      } else {
        setRangeValue1(maxValue - minGap);
      }
    } else {
      if (value >= minValue + minGap) {
        setRangeValue2(value);
      } else {
        setRangeValue2(minValue + minGap);
      }
    }
  };

  const applyFilters = () => {
    console.log("Dispatching price filter (PriceFilter2):", [
      rangeValue1,
      rangeValue2,
    ]);
    dispatch({ value: [rangeValue1, rangeValue2] });
    setOpenMobile(false); // Close mobile filter on apply
  };

  const handleInputChange = (e, isMin) => {
    handleChange(e, isMin);
  };

  // Update progress bar on value change
  useEffect(() => {
    updateProgress();
  }, [rangeValue1, rangeValue2]);

  // Initialize progress bar on mount
  useEffect(() => {
    updateProgress();
  }, []);

  return (
    <div className="woocomerce__filtering-brand shop-left">
      <div className="price-range-slider">
        <p className="range-value">
          <span>₹{rangeValue1}</span> - <span>₹{rangeValue2}</span>
        </p>
        <div style={{ marginTop: "10px" }}>
          <div className="custom_slider">
            <div className="slider_progress" ref={progressSlide}></div>
          </div>
          <div className="range_slier_imput">
            <input
              type="range"
              className="min_value"
              min={minPrice}
              max={maxPrice}
              value={rangeValue1}
              onChange={(e) => handleInputChange(e, true)}
              onMouseUp={applyFilters}
              onTouchEnd={applyFilters}
            />
            <input
              type="range"
              className="max_value"
              min={minPrice}
              max={maxPrice}
              value={rangeValue2}
              onChange={(e) => handleInputChange(e, false)}
              onMouseUp={applyFilters}
              onTouchEnd={applyFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
