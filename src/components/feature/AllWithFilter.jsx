import { useEffect, useState } from "react";
import ProductCard from "../common/card/ProductCard";
import Link from "next/link";
import { useGetProductsQuery } from "@/store/api/productApi";

const AllWithFilter = () => {
  const [latest, setLatest] = useState([]);
  const [isActive, setIsActive] = useState(1);

  // Use the getProducts query from productApi
  const { data, error, isLoading } = useGetProductsQuery({
    page: 1,
    resPerPage: 20,
    // Add other query params like keyword, category, min, max, ratings if needed
  });

  // Handle the fetched data
  useEffect(() => {
    if (data && data.filteredProducts && data.filteredProducts.length) {
      if (data.filteredProducts.length > 8) {
        let last = data.filteredProducts.slice(
          data.filteredProducts.length - 8,
          data.filteredProducts.length
        );
        setLatest(last);
      } else {
        setLatest(data.filteredProducts);
      }
    }
  }, [data]);

  // Filter function for the buttons
  const filterData = (filterKey, value) => {
    if (!data || !data.filteredProducts) return;

    let result = data.filteredProducts;
    if (filterKey !== "all") {
      if (
        filterKey === "man" ||
        filterKey === "woman" ||
        filterKey === "unisex"
      ) {
        result = data.filteredProducts.filter(
          (el) => el.gender.toLowerCase() === filterKey
        );
      } else if (filterKey === "floral") {
        result = data.filteredProducts.filter(
          (el) => el.category.toLowerCase() === filterKey
        );
      }
    }

    if (result.length > 8) {
      let last = result.slice(result.length - 8, result.length);
      setLatest(last);
    } else {
      setLatest(result);
    }
    setIsActive(value);
  };

  // Handle loading and error states
  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error fetching products: {error.message}</div>;

  return (
    <div className="woocomerce__feature woocomerce-padding wc_feature_products">
      <div className="woocomerce__feature-top">
        <p className="woocomerce__feature-title">(C) You may missed</p>
        {/* <div className="woocomerce__feature-rightwrapper rightwrapper2">
          <div className="woocomerce__feature-arrowwrapper">
            <ul className="nav nav-pills woocomerce__feature-filtermenu">
              <li>
                <button
                  onClick={() => filterData("all", 1)}
                  className={isActive === 1 ? "nav-link active" : "nav-link"}
                  type="button"
                >
                  All
                </button>
              </li>
              <li>
                <button
                  onClick={() => filterData("floral", 2)}
                  className={isActive === 2 ? "nav-link active" : "nav-link"}
                  type="button"
                >
                  Floral
                </button>
              </li>
              <li>
                <button
                  onClick={() => filterData("man", 3)}
                  className={isActive === 3 ? "nav-link active" : "nav-link"}
                  type="button"
                >
                  Man
                </button>
              </li>
              <li>
                <button
                  onClick={() => filterData("woman", 4)}
                  className={isActive === 4 ? "nav-link active" : "nav-link"}
                  type="button"
                >
                  Woman
                </button>
              </li>
              <li>
                <button
                  onClick={() => filterData("unisex", 5)}
                  className={isActive === 5 ? "nav-link active" : "nav-link"}
                  type="button"
                >
                  Unisex
                </button>
              </li>
            </ul>
          </div>
          <Link className="woocomerce__feature-viewall" href={"shop/full"}>
            View all
          </Link>
        </div> */}
      </div>

      <div>
        <div className="woocomerce__feature-wrapper filteringwrapper">
          {latest && latest.length ? (
            latest.map((el) => <ProductCard key={el._id} el={el} />)
          ) : (
            <p>No products available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllWithFilter;
