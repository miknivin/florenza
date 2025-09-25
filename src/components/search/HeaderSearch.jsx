import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useGetProductsQuery } from "@/store/api/productApi"; // Adjust path if needed
import debounce from "lodash/debounce";

export default function HeaderSearch() {
  const [searchValue, setSearchValue] = useState("");
  const [searchSlug, setSearchSlug] = useState([]);
  const router = useRouter();
  const searchHeader = useRef(null);
  const searchOpen = useRef(null);
  const searchClose = useRef(null);
  const inputData = useRef(null);

  // Fetch products only when searchValue is not empty
  const { data, isLoading, isError, error, isFetching } = useGetProductsQuery(
    {
      keyword: searchValue,
      page: 1,
      resPerPage: 10,
    },
    { skip: !searchValue } // Skip query if searchValue is empty
  );

  // Debug API response and loading state
  useEffect(() => {
    console.log("API State:", { data, isLoading, isFetching, isError, error });
    setSearchSlug(data?.filteredProducts || []);
  }, [data, isError, error, isLoading, isFetching]);

  // Debounce the search input
  const debouncedSetSearchValue = useRef(
    debounce((value) => {
      console.log("Debounced Search Value:", value);
      setSearchValue(value);
    }, 500)
  ).current;

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSetSearchValue.cancel();
    };
  }, [debouncedSetSearchValue]);

  const openSearch = () => {
    if (searchHeader.current && searchOpen.current && searchClose.current) {
      searchHeader.current.classList.add("open-search");
      searchOpen.current.style.display = "none";
      searchClose.current.style.display = "block";
    }
  };

  const closeSearch = () => {
    if (searchHeader.current && searchOpen.current && searchClose.current && inputData.current) {
      searchHeader.current.classList.remove("open-search");
      searchOpen.current.style.display = "block";
      searchClose.current.style.display = "none";
      inputData.current.value = "";
      setSearchValue("");
      setSearchSlug([]);
    }
  };

  const searchItem = (event) => {
    event.preventDefault();
    if (searchSlug?.length > 0) {
      router.push(`/shop/${searchSlug[0]._id}`);
      closeSearch();
    }
  };

  const navigate = (id) => {
    if (id) {
      router.push(`/shop/${id}`);
      closeSearch();
    }
  };

  return (
    <>
      <div>
        <button
          className="search-icon"
          ref={searchOpen}
          onClick={openSearch}
          id="search_icon"
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
        <button
          className="search-icon"
          ref={searchClose}
          onClick={closeSearch}
          id="search_close"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div className="header__search" ref={searchHeader}>
        <form autoComplete="off" onSubmit={searchItem}>
          <input
            type="text"
            name="s"
            autoComplete="off"
            ref={inputData}
            placeholder="Search products..."
            onChange={(event) => debouncedSetSearchValue(event.target.value)}
          />
          <div id="search-value">
            {(isLoading || isFetching) && searchValue ? (
              <div className="loading-spinner">
                <i className="fa-solid fa-spinner fa-spin"></i>
              </div>
            ) : isError && searchValue ? (
              <p>Error loading products: {error?.data?.message || "An error occurred"}</p>
            ) : searchValue && searchSlug?.length > 0 ? (
              searchSlug.map((el, i) => (
                <div
                  key={`${el._id || i}-search`}
                  className="search-item pointer_cursor"
                  onClick={() => navigate(el._id)}
                >
                  <p className="search-name">{el.name || "Unnamed Product"}</p>
                </div>
              ))
            ) : searchValue ? (
              <p>No results found for <span>{searchValue}</span></p>
            ) : (
              <p>Enter a product name to search</p>
            )}
          </div>
        </form>
      </div>
    </>
  );
}