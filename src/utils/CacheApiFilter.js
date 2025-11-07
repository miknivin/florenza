// utils/cacheFilters.js
class CacheFilters {
  constructor(products = [], query = {}) {
    this.products = products;
    this.query = query;
  }

  search() {
    const kw = this.query.keyword?.trim().toLowerCase();
    if (kw) {
      this.products = this.products.filter((p) =>
        p.name.toLowerCase().includes(kw)
      );
    }
    return this;
  }

  // ---- PRICE on variants ----
  filter() {
    const q = { ...this.query };
    delete q.keyword;
    delete q.page;
    delete q.resPerPage;

    // price[gte] / price[lte]
    const priceGte = q["price[gte]"] ? Number(q["price[gte]"]) : null;
    const priceLte = q["price[lte]"] ? Number(q["price[lte]"]) : null;
    delete q["price[gte]"];
    delete q["price[lte]"];

    // other field filters (gt/gte/lt/lte → plain comparison)
    const fieldFilters = {};
    for (const key in q) {
      const match = q[key].match(/([a-zA-Z0-9_]+)\[(gt|gte|lt|lte)\]/);
      if (match) {
        const field = match[1];
        const op = match[2];
        const val = Number(q[key]);
        fieldFilters[field] = fieldFilters[field] || {};
        fieldFilters[field][`$${op}`] = val;
      } else {
        fieldFilters[key] = q[key];
      }
    }

    this.products = this.products.filter((p) => {
      // price on variants
      if (priceGte !== null || priceLte !== null) {
        const hasMatch = p.variants?.some((v) => {
          const price = v.price;
          return (
            (priceGte === null || price >= priceGte) &&
            (priceLte === null || price <= priceLte)
          );
        });
        if (!hasMatch) return false;
      }

      // other field filters
      for (const field in fieldFilters) {
        const cond = fieldFilters[field];
        const val = p[field];
        for (const op in cond) {
          if (op === "$gt" && !(val > cond[op])) return false;
          if (op === "$gte" && !(val >= cond[op])) return false;
          if (op === "$lt" && !(val < cond[op])) return false;
          if (op === "$lte" && !(val <= cond[op])) return false;
        }
      }
      return true;
    });

    return this;
  }

  // ---- SORT (newest first) ----
  sort() {
    this.products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return this;
  }

  // ---- PAGINATION ----
  pagination(resPerPage) {
    const page = Number(this.query.page) || 1;
    const start = resPerPage * (page - 1);
    this.products = this.products.slice(start, start + resPerPage);
    return this;
  }

  // ---- RESULT ----
  result() {
    return this.products;
  }

  count() {
    return this.products.length;
  }
}

export default CacheFilters;
