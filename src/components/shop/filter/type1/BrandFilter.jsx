export default function BrandFilter({
  brand,
  open,
  setOpen,
  selectedBrand,
  dispatch,
  filterAll,
}) {
  const brandSelect = (data) => {
    let oldData = selectedBrand;
    let rawData = data.toLowerCase();
    if (oldData.includes(rawData)) {
      let activeIndex = oldData.indexOf(rawData);
      oldData.splice(activeIndex, 1);
    } else {
      oldData.splice(oldData.length, 0, rawData);
    }
    dispatch({
      type: "setSelectedBrand",
      value: oldData,
    });
    filterAll();
  };
  return (
    <>
      <span
        id="brand"
        className={
          selectedBrand && selectedBrand.length ? "item active" : "item"
        }
        onClick={() => setOpen(open === "brand" ? "" : "brand")}
      >
        {brand.name}
      </span>
      {open === "brand" ? (
        <div className="woocomerce__filtering-brand dropdowncommon">
          <span className="woocomerce__filtering-ftitle">{brand.name}</span>
          {brand.value.map((el, i) => (
            <div key={i + "brand"} className="woocomerce__filtering-catefield">
              <input
                type="checkbox"
                id={`brand${i}`}
                onChange={() => brandSelect(el)}
                checked={
                  selectedBrand.includes(el.toLowerCase()) ? true : false
                }
              />
              <label htmlFor={`brand${i}`}>{el}</label>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </>
  );
}
