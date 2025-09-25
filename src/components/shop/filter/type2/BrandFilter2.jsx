export default function BrandFilter2({
  brand,
  selectedBrand,
  dispatch,
  filterAll,
  setOpenMobile,
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
    setOpenMobile(false);
  };
  return (
    <>
      {brand.value && brand.value.length
        ? brand.value.map((el, i) => (
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
          ))
        : ""}
    </>
  );
}
