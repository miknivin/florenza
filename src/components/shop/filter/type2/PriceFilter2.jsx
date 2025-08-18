import { useRef, useState } from "react";

export default function PriceFilter({ allPrice, setOpenMobile, dispatch }) {
  // Use the first price range as default or set to reasonable values
  const minPrice = allPrice[0]?.[0] || 0;
  const maxPrice = allPrice[allPrice.length - 1]?.[1] || 10000;
  const [rangeValue1, setRangeValue1] = useState(minPrice);
  const [rangeValue2, setRangeValue2] = useState(maxPrice);
  const progressSlide = useRef(null);

  const updateProgress = () => {
    const minValue = parseInt(rangeValue1);
    const maxValue = parseInt(rangeValue2);
    if (progressSlide.current) {
      progressSlide.current.style.left = ((minValue - minPrice) / (maxPrice - minPrice)) * 100 + "%";
      progressSlide.current.style.right = ((maxPrice - maxValue) / (maxPrice - minPrice)) * 100 + "%";
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
    dispatch({ value: [rangeValue1, rangeValue2] });
  };

  // Update progress bar and dispatch filters on value change
  const handleInputChange = (e, isMin) => {
    handleChange(e, isMin);
    updateProgress();
    applyFilters();
  };

  // Initialize progress bar
  useState(() => {
    updateProgress();
  }, [rangeValue1, rangeValue2]);

  return (
    <>
      <div className="woocomerce__filtering-brand shop-left">
        <div className="price-range-slider">
          <p className="range-value">
            <span>${rangeValue1}</span> - <span>${rangeValue2}</span>
          </p>
          <div style={{ marginTop: "10px" }}>
            <div className="custom_slider">
              <div
                className="slider_progress"
                ref={progressSlide}
              ></div>
            </div>
            <div className="range_slier_imput">
              <input
                type="range"
                className="min_value"
                min={minPrice}
                max={maxPrice}
                value={rangeValue1}
                onChange={(e) => handleInputChange(e, true)}
                onTouchEnd={() => setOpenMobile(false)}
                onMouseLeave={() => setOpenMobile(false)}
              />
              <input
                type="range"
                className="max_value"
                min={minPrice}
                max={maxPrice}
                value={rangeValue2}
                onChange={(e) => handleInputChange(e, false)}
                onTouchEnd={() => setOpenMobile(false)}
                onMouseLeave={() => setOpenMobile(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}