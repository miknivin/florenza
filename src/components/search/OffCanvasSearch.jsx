import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function OffCanvasSearch({ allData }) {
  const [searchData, setSearchData] = useState(allData);
  const [searchValue, setSearchValue] = useState("");
  const [searchSlug, setSearchSlug] = useState([]);

  const router = useRouter();
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
        <form autoComplete="off" onSubmit={(event) => searchItem(event)}>
          <input
            type="text"
            name="s"
            autoComplete="off"
            ref={inputData}
            placeholder="Search.."
            onChange={(event) => setSearchValue(event.target.value)}
          />
          <button>
            <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon>
          </button>
        </form>
        <div id="search-value" style={{ marginTop: "20px" }}>
          {searchSlug && searchSlug.length
            ? searchSlug.map((el, i) => (
                <p
                  key={i + "search"}
                  className="search-name pointer_cursor"
                  onClick={() => navigate(el.id)}
                >
                  {el.title}
                </p>
              ))
            : ""}
        </div>
      </div>
    </>
  );
}
