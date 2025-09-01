import moment from "moment";

const filterFunction = (
  allData,
  selectedColor,
  selectedBrand,
  selectedRating,
  selectedSort,
  selectedPrice,
  selectedCategory
) => {
  let updateData = allData;
  if (selectedColor && selectedColor.length) {
    let filter = [];
    updateData.filter((el) => {
      selectedColor.map((el2) => {
        if (el.color.includes(el2)) {
          if (!filter.includes(el)) {
            filter.push(el);
          }
        }
      });
    });
    updateData = filter;
  }
  if (selectedBrand && selectedBrand.length) {
    let filter = [];
    updateData.filter((el) => {
      selectedBrand.map((el2) => {
        if (el.brand.toLowerCase() === el2) {
          if (!filter.includes(el)) {
            filter.push(el);
          }
        }
      });
    });
    updateData = filter;
  }
  if (selectedCategory && selectedCategory.length) {
    let filter = [];
    updateData.filter((el) => {
      selectedCategory.map((el2) => {
        if (el.category.toLowerCase() === el2) {
          if (!filter.includes(el)) {
            filter.push(el);
          }
        }
      });
    });
    updateData = filter;
  }
  if (selectedRating && selectedRating.length) {
    let filter = [];
    updateData.filter((el) => {
      selectedRating.map((el2) => {
        if (el.rating === el2) {
          if (!filter.includes(el)) {
            filter.push(el);
          }
        }
      });
    });
    updateData = filter;
  }
  if (selectedSort && selectedSort.length) {
    let filter = [];
    selectedSort.map((el) => {
      if (el === "rating") {
        let oldData = [...updateData];
        filter = oldData.sort((a, b) => {
          let num1 = parseFloat(a.rating);
          let num2 = parseFloat(b.rating);
          if (num1 <= num2) return 1;
          if (num1 > num2) return -1;
          return 0;
        });
      }
      if (el === "low") {
        let oldData = [...updateData];
        filter = oldData.sort((a, b) => {
          let num1 = parseFloat(a.price);
          let num2 = parseFloat(b.price);
          if (num1 >= num2) return 1;
          if (num1 < num2) return -1;
          return 0;
        });
      }
      if (el === "high") {
        let oldData = [...updateData];
        filter = oldData.sort((a, b) => {
          let num1 = parseFloat(a.price);
          let num2 = parseFloat(b.price);
          if (num1 <= num2) return 1;
          if (num1 > num2) return -1;
          return 0;
        });
      }
      if (el === "latest") {
        let oldData = [...updateData];
        filter = oldData.sort((a, b) => {
          let num1 = moment(a.submit_date, "YYYY-MM-DD").format();
          let num2 = moment(b.submit_date, "YYYY-MM-DD").format();
          if (moment(num1).isBefore(num2)) return 1;
          if (moment(num1).isSame(num2)) return 1;
          if (moment(num1).isAfter(num2)) return -1;
          return 0;
        });
      }
    });
    updateData = filter;
  }
  if (selectedPrice && selectedPrice.length) {
    let filter = updateData.filter(
      (item) => item.price >= selectedPrice[0] && item.price <= selectedPrice[1]
    );
    updateData = filter;
  }
  return updateData;
};

export default filterFunction;
