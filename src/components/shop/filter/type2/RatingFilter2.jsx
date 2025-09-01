export default function RatingFilter2({
  selectedRating,
  dispatch,
  filterAll,
  setOpenMobile,
}) {
  const ratingSelect = (data) => {
    let oldData = selectedRating;
    let rawData = data;
    if (oldData.includes(rawData)) {
      let activeIndex = oldData.indexOf(rawData);
      oldData.splice(activeIndex, 1);
    } else {
      oldData.splice(oldData.length, 0, rawData);
    }
    dispatch({
      type: "setSelectedRating",
      value: oldData,
    });
    filterAll();
    setOpenMobile(false);
  };
  return (
    <>
      <div className="woocomerce__filtering-catefield">
        <input
          type="checkbox"
          id="rateing_1"
          onChange={() => ratingSelect("1")}
          checked={selectedRating.includes("1") ? true : false}
        />
        <label htmlFor="rateing_1">
          <i className="fa-solid fa-star"></i>
        </label>
      </div>
      <div className="woocomerce__filtering-catefield">
        <input
          type="checkbox"
          id="rateing_2"
          onChange={() => ratingSelect("2")}
          checked={selectedRating.includes("2") ? true : false}
        />
        <label htmlFor="rateing_2">
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
        </label>
      </div>
      <div className="woocomerce__filtering-catefield">
        <input
          type="checkbox"
          id="rateing_3"
          onChange={() => ratingSelect("3")}
          checked={selectedRating.includes("3") ? true : false}
        />
        <label htmlFor="rateing_3">
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
        </label>
      </div>
      <div className="woocomerce__filtering-catefield">
        <input
          type="checkbox"
          id="rateing_4"
          onChange={() => ratingSelect("4")}
          checked={selectedRating.includes("4") ? true : false}
        />
        <label htmlFor="rateing_4">
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
        </label>
      </div>
      <div className="woocomerce__filtering-catefield">
        <input
          type="checkbox"
          id="rateing_5"
          onChange={() => ratingSelect("5")}
          checked={selectedRating.includes("5") ? true : false}
        />
        <label htmlFor="rateing_5">
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
        </label>
      </div>
    </>
  );
}
