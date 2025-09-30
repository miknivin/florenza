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
  });

  // Handle the fetched data
  useEffect(() => {
    if (data && data.filteredProducts && data.filteredProducts.length) {
      const variantOrder = {
        '50ml': 1,
        '12ml': 2,
        '20ml': 3,
        '30ml': 4,
        '100ml': 5,
        '150ml': 6,
      };

      const sorted = [...data.filteredProducts].sort((a, b) => {
        const variantA = a.variants && a.variants[0] ? a.variants[0].size : '';
        const variantB = b.variants && b.variants[0] ? b.variants[0].size : '';
        const orderA = variantOrder[variantA] || 999;
        const orderB = variantOrder[variantB] || 999;
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
      if (filterKey === "man" || filterKey === "woman" || filterKey === "unisex") {
        result = data.filteredProducts.filter(
          (el) => el.gender.toLowerCase() === filterKey
        );
      } else if (filterKey === "floral") {
        result = data.filteredProducts.filter(
          (el) => el.category.toLowerCase() === filterKey
        );
      }
    }
    const sorted = [...result].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    setLatest(sorted);
    setVisibleCount(4);
    setIsActive(value);
  };

  // CSS for the spinner
  const spinnerStyles = `
    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-left-color: #000000ff;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 20px auto;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="woocomerce__feature woocomerce-padding wc_feature_products">
        <style>{spinnerStyles}</style>
        <div className="spinner"></div>
        <p style={{ textAlign: "center",color:"white" }}>Loading products...</p>
      </div>
    );
  }
  if (error) return <div>Error fetching products: {error.message}</div>;

  return (
    <div className="woocomerce__feature woocomerce-padding wc_feature_products">
      <div className="woocomerce__feature-top">
        <p className="woocomerce__feature-title">Our products</p>
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