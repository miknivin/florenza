import { useState } from "react";

export default function CategoryFilter({
  category,
  open,
  setOpen,
  selectedCategory,
  dispatch,
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
  };

  return (
    <>
      <span
        id="category"
        className={selectedCategory.length ? "item active" : "item"}
        onClick={() => setOpen(open === "category" ? "" : "category")}
      >
        Category
      </span>
      {open === "category" ? (
        <div className="woocomerce__filtering-brand dropdowncommon">
          <span className="woocomerce__filtering-ftitle">Category</span>
          {category.map((el, i) => (
            <div
              key={i + "category"}
              className="woocomerce__filtering-catefield"
            >
              <input
                type="checkbox"
                id={`cate${i}`}
                onChange={() => categorySelect(el)}
                checked={selectedCategory.includes(el.toLowerCase())}
              />
              <label htmlFor={`cate${i}`}>{el}</label>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </>
  );
}
