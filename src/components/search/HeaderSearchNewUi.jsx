// HeaderSearchNewUi.js
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useGetProductsQuery } from "@/store/api/productApi"; // Adjust path if needed
import debounce from "lodash/debounce";
import SearchIcon from "../icons/SearchIcon";
import Link from "next/link";

export default function HeaderSearchNewUi() {
  const [searchValue, setSearchValue] = useState("");
  const [searchSlug, setSearchSlug] = useState([]);
  const router = useRouter();
  const inputRef = useRef(null);

  // Fetch products only when searchValue is not empty
  const { data, isLoading, isFetching, isError, error } = useGetProductsQuery(
    { keyword: searchValue, page: 1, resPerPage: 10 },
    { skip: !searchValue }
  );

  // Update dropdown results when API data changes
  useEffect(() => {
    setSearchSlug(data?.filteredProducts || []);
  }, [data]);

  // Debounce input changes to avoid too many API calls
  const debouncedSetSearchValue = useRef(
    debounce((value) => {
      setSearchValue(value.trim());
    }, 500)
  ).current;

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => debouncedSetSearchValue.cancel();
  }, [debouncedSetSearchValue]);

  // Navigate to product detail page
  const navigate = (id) => {
    if (id) {
      router.push(`/shop/${id}`);
      setSearchValue("");
      setSearchSlug([]);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  // Optional: Navigate on Enter if there's at least one result
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchSlug.length > 0) {
      e.preventDefault();
      navigate(searchSlug[0]._id);
    }
  };

  return (
    <>
      <div className="search-container z-3">
        <div className="search-wrapper mx-auto position-relative">
          {/* Search Icon */}
          <div className="search-icon">
            <SearchIcon />
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            ref={inputRef}
            autoComplete="off"
            onChange={(e) => debouncedSetSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* Dropdown Results */}
          {searchValue && (
            <div
              style={{ top: "100%", zIndex: 999, marginLeft: "-8px" }}
              className="position-absolute left-0 right-0 mt-1 bg-white border rounded-3 border-gray-200 w-100 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto"
            >
              {isLoading || isFetching ? (
                <div className="d-flex justify-content-center align-items-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : isError ? (
                <p className="p-4 text-red-600 text-sm">
                  Error: {error?.data?.message || "Failed to load results"}
                </p>
              ) : searchSlug.length > 0 ? (
                searchSlug.map((product) => (
                  <div
                    key={product._id}
                    class="search-result-item"
                    onclick="navigateToProduct('${product._id}')"
                  >
                    <Link
                      href={`/shop/${product._id}`}
                      class="search-result-name"
                    >
                      {product.name || "Unnamed Product"}
                    </Link>
                  </div>
                ))
              ) : (
                <p className="p-4 text-gray-500 text-sm text-start">
                  No results found for{" "}
                  <span className="font-medium">"{searchValue}"</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
