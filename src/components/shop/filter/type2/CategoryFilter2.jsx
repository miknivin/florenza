// src/components/shop/filter/type2/CategoryFilter2.jsx
import { useEffect } from "react";

export default function CategoryFilter2({
  category,
  setOpenMobile,
  selectedCategory,
  dispatch,
  filterAll,
}) {
  const categorySelect = (data) => {
    let newSelected = [...selectedCategory];
    if (newSelected.includes(data)) {
      newSelected = newSelected.filter((item) => item !== data);
    } else {
      newSelected.push(data);
    }
    dispatch({ value: newSelected });
    setOpenMobile(false); // Close mobile filter after selection
  };

  useEffect(() => {
    console.log("Mobile Categories:", category);
    console.log("Mobile Selected Categories:", selectedCategory);
    console.log("setOpenMobile is function:", typeof setOpenMobile === "function");
  }, [category, selectedCategory, setOpenMobile]);

  return (
    <div className="woocomerce__filtering-brand">
      {category.length > 0 ? (
        category.map((el, i) => (
          <div key={i + "category"} className="woocomerce__filtering-catefield">
            <input
              type="checkbox"
              id={`cate-mobile${i}`}
              onChange={() => categorySelect(el)}
              checked={selectedCategory.includes(el)}
            />
            <label htmlFor={`cate-mobile${i}`}>{el}</label>
          </div>
        ))
      ) : (
        <p>No categories available</p>
      )}
    </div>
  );
}