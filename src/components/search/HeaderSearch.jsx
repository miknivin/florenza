import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function HeaderSearch({ allData }) {
  const [searchData, setSearchData] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [searchSlug, setSearchSlug] = useState([]);

  const router = useRouter();
  const searchHeader = useRef();
  const searchOpen = useRef();
  const searchClose = useRef();
  const inputData = useRef();

  useEffect(() => {
    if (searchData && searchData.length) {
      if (searchValue) {
        const allSlug = [];
        searchData.map((el) => {
          let result = el.title
            .toLowerCase()
            .includes(searchValue.toLowerCase());
          if (result) {
            allSlug.push(el);
          }
        });
        setSearchSlug(allSlug);
      } else {
        const allSlug = [];
        setSearchSlug(allSlug);
      }
    }
  }, [searchValue, searchData]);

  const openSearch = () => {
    searchHeader.current.classList.add("open-search");
    searchOpen.current.style.display = "none";
    searchClose.current.style.display = "block";
    setSearchData(allData);
  };
  const closeSearch = () => {
    searchHeader.current.classList.remove("open-search");
    searchOpen.current.style.display = "block";
    searchClose.current.style.display = "none";
    inputData.current.value = "";
    setSearchSlug([]);
  };

  const searchItem = (event) => {
    event.preventDefault();
    if (searchSlug && searchSlug.length) {
      router.push("/shop/" + searchSlug[0].id);
    }
  };
  const navigate = (data) => {
    router.push("/shop/" + data);
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
        <form autoComplete="off" onSubmit={(event) => searchItem(event)}>
          <input
            type="text"
            name="s"
            autoComplete="off"
            ref={inputData}
            placeholder="Search.."
            onChange={(event) => setSearchValue(event.target.value)}
          />
          <div id="search-value">
            {searchSlug && searchSlug.length
              ? searchSlug.map((el, i) => (
                  <p
                    key={i + "search"}
                    className="search-name pointer_cursor"
                    onClick={() => {
                      navigate(el.id);
                      closeSearch();
                    }}
                  >
                    {el.title}
                  </p>
                ))
              : ""}
          </div>
        </form>
      </div>
    </>
  );
}
