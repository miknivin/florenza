// src/components/shop/filter/type1/CategoryFilter.jsx
import { useEffect } from "react";

export default function CategoryFilter({
  category,
  open,
  setOpen,
  selectedCategory,
  dispatch,
}) {
  const categorySelect = (data) => {
    let newSelected = [...selectedCategory];
    if (newSelected.includes(data)) {
      newSelected = newSelected.filter((item) => item !== data);
    } else {
      newSelected.push(data);
    }
    dispatch({ value: newSelected });
  };

  useEffect(() => {
    console.log("Categories in CategoryFilter:", category);
    console.log("Selected Categories:", selectedCategory);
  }, [category, selectedCategory]);

  return (
    <>
      <span
        id="category"
        className={selectedCategory.length ? "item active" : "item"}
        onClick={() => {
          console.log("Toggling open state:", open === "category" ? "" : "category");
          setOpen(open === "category" ? "" : "category");
        }}
      >
        Category
      </span>
      {open === "category" ? (
        <div className="woocomerce__filtering-brand dropdowncommon">
          <span className="woocomerce__filtering-ftitle">Category</span>
          {category.length > 0 ? (
            category.map((el, i) => (
              <div
                key={i + "category"}
                className="woocomerce__filtering-catefield"
              >
                <input
                  type="checkbox"
                  id={`cate${i}`}
                  onChange={() => categorySelect(el)}
                  checked={selectedCategory.includes(el)}
                />
                <label htmlFor={`cate${i}`}>{el}</label>
              </div>
            ))
          ) : (
            <p>No categories available</p>
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
}