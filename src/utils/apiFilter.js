class APIFilters {
  constructor(query, queryStr) {
    this.query = query || []; // Ensure query is initialized (assumes query is a Mongoose query object)
    this.queryStr = queryStr || {};
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    const fieldsToRemove = ["keyword", "page", "resPerPage"];

    // Remove non-filter fields
    fieldsToRemove.forEach((el) => delete queryCopy[el]);

    // Handle price filtering for variants
    if (queryCopy["price[gte]"] || queryCopy["price[lte]"]) {
      const priceFilter = {};
      if (queryCopy["price[gte]"]) {
        priceFilter.$gte = Number(queryCopy["price[gte]"]);
        delete queryCopy["price[gte]"];
      }
      if (queryCopy["price[lte]"]) {
        priceFilter.$lte = Number(queryCopy["price[lte]"]);
        delete queryCopy["price[lte]"];
      }
      // Use $elemMatch to filter products with at least one variant matching the price range
      this.query = this.query.find({
        variants: {
          $elemMatch: {
            price: priceFilter,
          },
        },
      });
    }

    // Handle other filters (e.g., category)
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // Sort by createdAt in descending order (last created first)
    this.query = this.query.sort({ createdAt: -1 });
    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

export default APIFilters;
