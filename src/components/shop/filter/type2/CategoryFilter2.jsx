import { useState } from "react";

export default function CategoryFilter2({
  category,
  selectedCategory,
  dispatch,
  setOpenMobile,
}) {
  const categorySelect = (data) => {
    const rawData = data.toLowerCase();
    let newSelected = [...selectedCategory];
    if (newSelected.includes(rawData)) {
      newSelected = newSelected.filter((item) => item !== rawData);
    } else {
      newSelected.push(rawData);
    }
    dispatch({ value: newSelected });
    setOpenMobile(false);
  };

  return (
    <div className="woocomerce__filtering-brand shop-left">
      {category && category.length ? (
        category.map((el, i) => (
          <div key={i + "category"} className="woocomerce__filtering-catefield">
            <input
              type="checkbox"
              id={`cate${i}`}
              onChange={() => categorySelect(el)}
              checked={selectedCategory.includes(el.toLowerCase())}
              onTouchEnd={() => setOpenMobile(false)}
              onMouseLeave={() => setOpenMobile(false)}
            />
            <label htmlFor={`cate${i}`}>{el}</label>
          </div>
        ))
      ) : (
        <p>No categories available</p>
      )}
    </div>
  );
}
