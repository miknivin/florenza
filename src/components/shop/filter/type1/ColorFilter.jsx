export default function ColorFilter({
  allColor,
  open,
  setOpen,
  selectedColor,
  dispatch,
  filterAll,
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
  };
  return (
    <>
      <span
        id="color"
        className={
          selectedColor && selectedColor.length
            ? "item active"
            : "item"
        }
        onClick={() => setOpen(open === "color" ? "" : "color")}
      >
        {allColor.name}
      </span>
      {open === "color" ? (
        <div className="woocomerce__filtering-colors">
          <span className="woocomerce__filtering-ftitle">{allColor.name}</span>
          {allColor.value.map((el, i) => (
            <span
              key={i + "color"}
              className={
                selectedColor.includes(el.name.toLowerCase())
                  ? "fil_color active"
                  : "fil_color"
              }
              onClick={() => colorSelect(el.name)}
              style={{
                backgroundColor: `${el.color}`,
              }}
            ></span>
          ))}
        </div>
      ) : (
        ""
      )}
    </>
  );
}
