export default function SortFilter2({
  sort,
  selectedSort,
  dispatch,
  filterAll,
  setOpenMobile,
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
    setOpenMobile(false);
  };
  return (
    <>
      {sort.value && sort.value.length
        ? sort.value.map((el, i) => (
            <div key={i + "sort"} className="woocomerce__filtering-catefield">
              <input
                type="checkbox"
                id={`sort${i}`}
                onChange={() => sortSelect(el.key)}
                checked={selectedSort[0] == el.key ? true : false}
              />
              <label htmlFor={`sort${i}`}>{el.name}</label>
            </div>
          ))
        : ""}
    </>
  );
}
