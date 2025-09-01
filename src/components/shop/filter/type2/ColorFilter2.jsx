export default function ColorFilter2({
  allColor,
  selectedColor,
  dispatch,
  filterAll,
  setOpenMobile,
}) {
  const colorSelect = (data) => {
    let oldData = selectedColor;
    let rawData = data.toLowerCase();
    if (oldData.includes(rawData)) {
      let activeIndex = oldData.indexOf(rawData);
      oldData.splice(activeIndex, 1);
    } else {
      oldData.splice(oldData.length, 0, rawData);
    }
    dispatch({
      type: "setSelectedColor",
      value: oldData,
    });
    filterAll();
    setOpenMobile(false);
  };
  return (
    <>
      {allColor.value && allColor.value.length
        ? allColor.value.map((el, i) => (
            <div key={i + "color"} className="woocomerce__filtering-catefield">
              <input
                type="checkbox"
                id={`color${i}`}
                onChange={() => colorSelect(el.name)}
                checked={
                  selectedColor.includes(el.name.toLowerCase()) ? true : false
                }
              />
              <label htmlFor={`color${i}`}>{el.name}</label>
            </div>
          ))
        : ""}
    </>
  );
}
