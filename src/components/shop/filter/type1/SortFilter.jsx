export default function SortFilter({
  sort,
  open,
  setOpen,
  selectedSort,
  dispatch,
  filterAll,
}) {
  const sortSelect = (data) => {
    let oldData = selectedSort;
    let rawData = data;
    if (oldData.includes(rawData)) {
      oldData.splice(0, oldData.length);
    } else {
      oldData.length = 0;
      oldData.splice(oldData.length, 0, rawData);
    }
    dispatch({
      type: "setSelectedSort",
      value: oldData,
    });
    filterAll();
  };
  return (
    <>
      <span
        id="sort"
        className={selectedSort && selectedSort.length ? "item active" : "item"}
        onClick={() => setOpen(open === "sort" ? "" : "sort")}
      >
        {sort.name}
      </span>
      {open === "sort" ? (
        <div className="woocomerce__filtering-sort dropdowncommon">
          <span className="woocomerce__filtering-ftitle">{sort.name}</span>
          {sort.value.map((el, i) => (
            <div key={i + "sort"} className="woocomerce__filtering-catefield">
              <input
                type="checkbox"
                id={`sort${i}`}
                onChange={() => sortSelect(el.key)}
                checked={selectedSort[0] == el.key ? true : false}
              />
              <label htmlFor={`sort${i}`}>{el.name}</label>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </>
  );
}
