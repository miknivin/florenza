// src/components/shop/FullWidth.jsx
"use client";
import { useState, useEffect } from "react";
import { Accordion } from "react-bootstrap";
import ProductCard2 from "../common/card/ProductCard2";
import CategoryFilter from "./filter/type1/CategoryFilter";
import PriceFilter from "./filter/type1/PriceFilter";
import CategoryFilter2 from "./filter/type2/CategoryFilter2";
import PriceFilter2 from "./filter/type2/PriceFilter2";
import { useGetProductsQuery } from "@/store/api/productApi";
import { Preloader } from "..";

const FullWidth = () => {
  const [open, setOpen] = useState("");
  const [openMobile, setOpenMobile] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    keyword: "",
    resPerPage: 20,
    category: [],
    min: null,
    max: null,
  });

  const queryParams = {
    page: filters.page,
    keyword: filters.keyword,
    resPerPage: filters.resPerPage,
    category: filters.category.length ? filters.category.join(",") : undefined,
    min: filters.min !== null ? filters.min : undefined,
    max: filters.max !== null ? filters.max : undefined,
  };

  const { data, isLoading, isFetching, error } =
    useGetProductsQuery(queryParams);

  const allFilter = {
    category: data?.filters?.categories || [],
    price: data?.filters?.prices || [
      [0, 1000],
      [1000, 5000],
      [5000, 10000],
    ],
  };

  if (isLoading) {
    return <Preloader />;
  }

  const showData = data?.filteredProducts || [];

  const updateFilters = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // useEffect(() => {
  //   console.log("Current filters:", filters);
  // }, [filters]);

  const handleSearch = (e) => {
    updateFilters("keyword", e.target.value);
  };

  return (
    <>
      <div className="woocomerce__filtering woocomerce-padding">
        {allFilter && Object.keys(allFilter).length ? (
          <div>
            <div className="woocomerce__filtering-wrapper">
              <div className="woocomerce__filtering-left">
                <div className="woocomerce__filtering-leftinner">
                  <span className="woocomerce__filtertitle">Shop by :</span>
                  <ul className="woocomerce__sortbuttons">
                    <li>
                      <CategoryFilter
                        category={allFilter.category}
                        open={open}
                        setOpen={setOpen}
                        selectedCategory={filters.category}
                        dispatch={(action) =>
                          updateFilters("category", action.value)
                        }
                        filterAll={() => {}}
                      />
                    </li>
                    <li>
                      <PriceFilter
                        allPrice={allFilter.price}
                        open={open}
                        setOpen={setOpen}
                        dispatch={(action) => {
                          updateFilters("min", action.value[0]);
                          updateFilters("max", action.value[1]);
                        }}
                      />
                    </li>
                  </ul>
                </div>
              </div>
              <div className="woocommerce__filtering-right">
                <form action="#">
                  <input
                    placeholder="Type your keywords"
                    type="text"
                    name="search"
                    onChange={handleSearch}
                    className="woocomerce__search"
                  />
                </form>
              </div>
            </div>
            <div className="woocomerce__filtering-mobwrapper">
              <span
                className="woocomerce__filtering-filtericon"
                onClick={() => setOpenMobile(!openMobile)}
              >
                <i className="fa-solid fa-filter"></i> filtering
              </span>
            </div>

            {openMobile ? (
              <div className="woc__sfw_mobile">
                <div className="woocomerce__shopsidebar showed">
                  <Accordion
                    className="accordion short-by"
                    id="accordionExample"
                  >
                    <h3 className="woocomerce__shopsidebar-title">Shop by :</h3>
                    <Accordion.Item eventKey="1" className="accordion-item">
                      <Accordion.Header className="accordion-header">
                        Category
                      </Accordion.Header>
                      <Accordion.Body>
                        <CategoryFilter2
                          category={allFilter.category}
                          setOpenMobile={setOpenMobile}
                          selectedCategory={filters.category}
                          dispatch={(action) =>
                            updateFilters("category", action.value)
                          }
                          filterAll={() => {}}
                        />
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3" className="accordion-item">
                      <Accordion.Header className="accordion-header">
                        Price
                      </Accordion.Header>
                      <Accordion.Body>
                        <PriceFilter2
                          allPrice={allFilter.price}
                          setOpenMobile={setOpenMobile}
                          dispatch={(action) => {
                            updateFilters("min", action.value[0]);
                            updateFilters("max", action.value[1]);
                          }}
                          initialMin={filters.min}
                          initialMax={filters.max}
                        />
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}

        <div className="woocomerce__shopinner wc_feature_products">
          <div className="woocomerce__feature-wrapper filteringwrapper">
            {isLoading || isFetching ? (
              <div className="d-flex justify-content-start w-100">
                <div className="spinner-border text-dark" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <p>
                Error loading products: {error?.data?.message || error.message}
              </p>
            ) : showData && showData.length ? (
              showData.map((el) => <ProductCard2 el={el} key={el._id} />)
            ) : (
              <p>No Product Found</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FullWidth;
