import { useEffect, useState } from "react";
import ProductCard from "../common/card/ProductCard";
import Link from "next/link";
import { useGetProductsQuery } from "@/store/api/productApi";

const AllWithFilter = () => {
  const [latest, setLatest] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
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
      // Custom sorting order for variants
      const variantOrder = {
        '50ml': 1,
        '12ml': 2,
        '20ml':3,
        '30ml': 4,
        '100ml': 5,
        '150ml': 6
      };
      
      const sorted = [...data.filteredProducts].sort((a, b) => {
        // Get the first variant's size from each product
        const variantA = a.variants && a.variants[0] ? a.variants[0].size : '';
        const variantB = b.variants && b.variants[0] ? b.variants[0].size : '';
        
        // Get the order values, default to a high number if variant not in order list
        const orderA = variantOrder[variantA] || 999;
        const orderB = variantOrder[variantB] || 999;
        
        // Sort by variant order
        return orderA - orderB;
      });
      
      setLatest(sorted);
      setVisibleCount(4);
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
    // Sort filtered results by createdAt ascending
    const sorted = [...result].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    setLatest(sorted);
    setVisibleCount(4);
    setIsActive(value);
  };

  // Handle loading and error states
  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error fetching products: {error.message}</div>;

  return (
    <div className="woocomerce__feature woocomerce-padding wc_feature_products">
      <div className="woocomerce__feature-top">
        <p className="woocomerce__feature-title">Our products</p>
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
            latest
              .slice(0, visibleCount)
              .map((el) => <ProductCard key={el._id} el={el} />)
          ) : (
            <p>No products available</p>
          )}
        </div>
        {latest.length > visibleCount && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              style={{
                background: "#ffffffff",
                color: "#000000ff",
                border: "none",
                padding: "8px 21px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => setVisibleCount((prev) => prev + 4)}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllWithFilter;
